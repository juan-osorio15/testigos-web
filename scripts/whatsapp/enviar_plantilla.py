#!/usr/bin/env python3
"""Envía una plantilla aprobada de WhatsApp a cada persona de una lista, una por una, con la Cloud API de Meta.

La lista es la salida de scripts/pretix/expirados_sin_compra.py (columnas
whatsapp, pedidos, desde_fecha y prueba). La variable {{1}} del cuerpo se
llena con el último código de pedido de cada persona.

Por defecto NO envía nada: lee la plantilla en Meta, comprueba que esté
aprobada y muestra cómo queda el mensaje de cada persona. Para enviar de
verdad hay que pasar --enviar.

Variables de entorno (ver docs/campana-expirados/titular/whatsapp.md):
    WHATSAPP_TOKEN     token del usuario del sistema
    WHATSAPP_WABA_ID   identificador de la cuenta de WhatsApp Business
    WHATSAPP_PHONE_ID  identificador del número (opcional si la cuenta tiene un solo número)

Uso:
    python3 scripts/whatsapp/enviar_plantilla.py LISTA.csv \
        --plantilla pedido_expirado_ayuda \
        --registro ~/Downloads/envios-whatsapp-expirados.csv \
        [--prueba 573001234567] [--enviar]

Protecciones:
- Por defecto solo toma las filas con desde_fecha = si (--grupo).
- Se niega a enviar fuera del horario de la Ley 2300 de 2023 (el mismo
  control que el script de correo). --ignorar-horario lo salta, solo por
  decisión explícita del titular.
- --registro guarda cada envío; a quien ya aparece ahí no se le vuelve a
  escribir con la misma plantilla.
- --prueba manda un solo mensaje de muestra (con un pedido real) a ese número.
- Si Meta rechaza un número, lo anota como fallido y sigue; si rechaza el
  token o la plantilla, se detiene.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "correo"))
from enviar_resend import BOGOTA, horario_permitido  # noqa: E402  (un solo lugar para festivos y horario)

GRAPH = "https://graph.facebook.com/v23.0"

# Errores de Meta que significan que el problema no es del número sino del
# token, los permisos o la plantilla: no tiene sentido seguir con los demás.
ERRORES_FATALES = {0, 3, 10, 100, 190, 200, 131005, 131008, 131009, 132000, 132001, 132005,
                   132007, 132012, 132015, 132016, 133010}


class ErrorMeta(Exception):
    def __init__(self, estado: int, codigo: int, mensaje: str):
        super().__init__(f"{estado} · código {codigo} · {mensaje}")
        self.codigo = codigo


def llamar(token: str, ruta: str, cuerpo: dict | None = None) -> dict:
    pedido = urllib.request.Request(
        f"{GRAPH}/{ruta}",
        data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST" if cuerpo is not None else "GET",
    )
    try:
        with urllib.request.urlopen(pedido, timeout=30) as respuesta:
            return json.load(respuesta)
    except urllib.error.HTTPError as error:
        texto = error.read().decode()
        try:
            detalle = json.loads(texto)["error"]
            raise ErrorMeta(error.code, detalle.get("code", 0),
                            detalle.get("error_user_msg") or detalle.get("message", texto)) from None
        except (ValueError, KeyError):
            raise ErrorMeta(error.code, 0, texto) from None


def leer_plantilla(token: str, waba: str, nombre: str, idioma: str) -> str:
    """Devuelve el cuerpo de la plantilla aprobada, o se detiene explicando por qué no sirve."""
    consulta = urllib.parse.urlencode({"name": nombre, "fields": "name,status,language,components"})
    plantillas = [p for p in llamar(token, f"{waba}/message_templates?{consulta}")["data"] if p["name"] == nombre]
    if not plantillas:
        sys.exit(f"No existe la plantilla {nombre} en la cuenta {waba}.")
    elegida = next((p for p in plantillas if p["language"] == idioma), None)
    if not elegida:
        idiomas = ", ".join(p["language"] for p in plantillas)
        sys.exit(f"La plantilla {nombre} no está en el idioma {idioma}; está en: {idiomas}. Usar --idioma.")
    if elegida["status"] != "APPROVED":
        sys.exit(f"La plantilla {nombre} ({idioma}) está en estado {elegida['status']}, no aprobada.")
    cuerpo = next(c["text"] for c in elegida["components"] if c["type"] == "BODY")
    variables = set(re.findall(r"\{\{(\w+)\}\}", cuerpo))
    if variables != {"1"}:
        sys.exit(f"El script llena solo {{{{1}}}} y la plantilla usa: {sorted(variables)}.")
    pie = next((c["text"] for c in elegida["components"] if c["type"] == "FOOTER"), "")
    return cuerpo + (f"\n\n{pie}" if pie else "")


def elegir_numero(token: str, waba: str) -> str:
    numeros = llamar(token, f"{waba}/phone_numbers?fields=id,display_phone_number,verified_name")["data"]
    if len(numeros) == 1:
        print(f"Se envía desde {numeros[0]['display_phone_number']} ({numeros[0]['verified_name']}).")
        return numeros[0]["id"]
    lista = "\n".join(f"  {n['id']}  {n['display_phone_number']}  {n['verified_name']}" for n in numeros)
    sys.exit(f"La cuenta tiene {len(numeros)} números; poner el de envío en WHATSAPP_PHONE_ID:\n{lista}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("lista", help="CSV de expirados_sin_compra.py")
    parser.add_argument("--plantilla", required=True, help="Nombre de la plantilla aprobada en Meta")
    parser.add_argument("--idioma", default="es", help="Código de idioma de la plantilla (por defecto es)")
    parser.add_argument("--grupo", choices=["si", "no", "todos"], default="si",
                        help="Filtra por la columna desde_fecha (por defecto si: solo quien autorizó WhatsApp)")
    parser.add_argument("--registro", required=True, help="CSV con los envíos hechos (se crea si no existe)")
    parser.add_argument("--prueba", help="Mandar un solo mensaje de muestra a este número (con 57 adelante)")
    parser.add_argument("--enviar", action="store_true", help="Enviar de verdad (sin esto solo se muestra cómo queda)")
    parser.add_argument("--ignorar-horario", action="store_true",
                        help="Enviar aunque sea fuera del horario de la Ley 2300 (decisión explícita del titular)")
    args = parser.parse_args()

    token = os.environ.get("WHATSAPP_TOKEN")
    waba = os.environ.get("WHATSAPP_WABA_ID")
    if not token or not waba:
        sys.exit("Faltan las variables de entorno WHATSAPP_TOKEN y WHATSAPP_WABA_ID.")
    try:
        cuerpo = leer_plantilla(token, waba, args.plantilla, args.idioma)
    except ErrorMeta as error:
        sys.exit(f"Meta no dejó leer la plantilla: {error}")

    with open(args.lista, encoding="utf-8-sig", newline="") as archivo:
        filas = list(csv.DictReader(archivo))
    if filas and "desde_fecha" not in filas[0]:
        sys.exit("La lista no tiene la columna desde_fecha: correr expirados_sin_compra.py con --desde.")
    if args.grupo != "todos":
        filas = [f for f in filas if f["desde_fecha"] == args.grupo]

    registro = Path(args.registro).expanduser()
    ya_enviados = set()
    if registro.exists():
        with open(registro, encoding="utf-8", newline="") as archivo:
            ya_enviados = {(r["whatsapp"], r["plantilla"]) for r in csv.DictReader(archivo)
                           if r["prueba"] == "no" and r["estado"] == "enviado"}

    pendientes = []
    for fila in filas:
        if not fila["whatsapp"]:
            print(f"Sin teléfono, se omite: {fila['pedidos']}")
            continue
        if (fila["whatsapp"], args.plantilla) in ya_enviados and not args.prueba:
            print(f"Ya se le envió esta plantilla, se omite: {fila['whatsapp']}")
            continue
        pendientes.append((fila["whatsapp"], fila["pedidos"].split()[-1]))

    for numero, codigo in pendientes:
        print(f"\n--- {numero} · pedido {codigo}")
        print(cuerpo.replace("{{1}}", codigo))
    print(f"\n{len(pendientes)} mensajes listos.")

    if not args.enviar:
        print("No se envió nada (falta --enviar).")
        return

    if args.prueba and pendientes:
        # Una sola muestra, con el código de un pedido real si lo hay.
        pendientes = [(args.prueba, next((c for _, c in pendientes if c != "PRUEBA"), pendientes[0][1]))]

    motivo = horario_permitido(datetime.now(BOGOTA))
    if motivo and args.ignorar_horario:
        print(f"Aviso: {motivo}; se envía igual por --ignorar-horario.")
    elif motivo:
        sys.exit(f"No se envía: {motivo} (Ley 2300 de 2023).")

    try:
        telefono = os.environ.get("WHATSAPP_PHONE_ID") or elegir_numero(token, waba)
    except ErrorMeta as error:
        sys.exit(f"Meta no dejó leer los números de la cuenta: {error}")

    nuevo = not registro.exists()
    enviados = fallidos = 0
    with open(registro, "a", encoding="utf-8", newline="") as archivo:
        escritor = csv.writer(archivo)
        if nuevo:
            escritor.writerow(["fecha", "whatsapp", "pedido", "plantilla", "prueba", "estado", "id_meta", "detalle"])
        for numero, codigo in pendientes:
            mensaje = {
                "messaging_product": "whatsapp",
                "to": numero,
                "type": "template",
                "template": {
                    "name": args.plantilla,
                    "language": {"code": args.idioma},
                    "components": [{"type": "body", "parameters": [{"type": "text", "text": codigo}]}],
                },
            }
            ahora = datetime.now(BOGOTA).isoformat(timespec="seconds")
            prueba = "si" if args.prueba else "no"
            try:
                identificador = llamar(token, f"{telefono}/messages", mensaje)["messages"][0]["id"]
            except ErrorMeta as error:
                escritor.writerow([ahora, numero, codigo, args.plantilla, prueba, "fallido", "", str(error)])
                archivo.flush()
                if error.codigo in ERRORES_FATALES:
                    sys.exit(f"Meta rechazó el envío a {numero} y se detiene todo: {error}")
                print(f"No se pudo enviar a {numero} ({codigo}): {error}")
                fallidos += 1
                continue
            escritor.writerow([ahora, numero, codigo, args.plantilla, prueba, "enviado", identificador, ""])
            archivo.flush()
            print(f"Enviado a {numero} ({codigo}): {identificador}")
            enviados += 1
            time.sleep(1)
    print(f"\n{enviados} enviados, {fallidos} fallidos. Registro: {registro}")


if __name__ == "__main__":
    main()
