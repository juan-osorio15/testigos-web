#!/usr/bin/env python3
"""Envía un correo HTML a cada persona de una lista, uno por uno, con Resend.

La lista es la salida de scripts/pretix/expirados_sin_compra.py (columnas
correo, pedidos y, si se usó --desde, desde_fecha). En la plantilla HTML,
{{codigo}} se cambia por el último código de pedido de cada persona.
Las imágenes con src="cid:NOMBRE" se adjuntan incrustadas desde
NOMBRE.png en la carpeta de la plantilla (el logo no tiene URL pública).

Por defecto NO envía nada: escribe una vista previa por persona en la
carpeta indicada con --previas. Para enviar de verdad hay que pasar
--enviar y tener la llave en la variable de entorno RESEND_API_KEY.

Uso:
    python3 scripts/correo/enviar_resend.py LISTA.csv \
        --plantilla scripts/correo/plantillas/expirado.html \
        --asunto "Tu pedido de Testigos de la Memoria" \
        --grupo todos --previas ~/Downloads/previas-expirados \
        --registro ~/Downloads/envios-expirados.csv \
        [--prueba tu@correo.com] [--enviar]

Protecciones:
- Se niega a enviar fuera del horario de la Ley 2300 de 2023 (hora de
  Bogotá: lunes a viernes 7:00 a 19:00, sábados 8:00 a 15:00, nunca
  domingos ni festivos).
- --registro guarda cada envío; a quien ya aparece ahí no se le vuelve a
  escribir con la misma plantilla.
  --ignorar-horario lo salta, solo por decisión explícita del titular.
- --prueba manda un solo correo de muestra (con un pedido real) a esa dirección.
"""

from __future__ import annotations

import argparse
import base64
import csv
import html as html_lib
import re
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

BOGOTA = timezone(timedelta(hours=-5))

# Festivos de Colombia. Agregar el año siguiente antes de usar el script en él.
FESTIVOS = {
    "2026-01-01", "2026-01-12", "2026-03-23", "2026-04-02", "2026-04-03",
    "2026-05-01", "2026-05-18", "2026-06-08", "2026-06-15", "2026-06-29",
    "2026-07-20", "2026-08-07", "2026-08-17", "2026-10-12", "2026-11-02",
    "2026-11-16", "2026-12-08", "2026-12-25",
}

REMITENTE = "Testigos de la Memoria <hola@eventalist.co>"
RESPONDER_A = "hola@eventalist.co"


def horario_permitido(ahora: datetime) -> str | None:
    """Devuelve el motivo si no se puede enviar ahora, o None si se puede."""
    dia = ahora.date()
    if str(dia.year) not in {f[:4] for f in FESTIVOS}:
        return f"no hay festivos cargados para {dia.year}"
    if dia.isoformat() in FESTIVOS:
        return "hoy es festivo"
    hora = ahora.hour + ahora.minute / 60
    if ahora.weekday() == 6:
        return "hoy es domingo"
    if ahora.weekday() == 5 and not 8 <= hora < 15:
        return "los sábados solo de 8:00 a 15:00"
    if ahora.weekday() < 5 and not 7 <= hora < 19:
        return "entre semana solo de 7:00 a 19:00"
    return None


def a_texto(html: str) -> str:
    """Versión en texto plano, para los clientes de correo que no muestran HTML."""
    sin_estilo = re.sub(r"<(style|head)[^>]*>.*?</\1>", "", html, flags=re.S | re.I)
    con_enlaces = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', r"\2 (\1)", sin_estilo, flags=re.S)
    con_saltos = re.sub(r"</(p|h1|h2|div|tr)>|<br\s*/?>", "\n", con_enlaces, flags=re.I)
    texto = re.sub(r"<[^>]+>", "", con_saltos)
    lineas = [" ".join(l.split()) for l in texto.splitlines()]
    return html_lib.unescape(re.sub(r"\n{3,}", "\n\n", "\n".join(lineas)).strip())


def imagenes_incrustadas(plantilla: Path, html: str) -> dict[str, Path]:
    """Busca src="cid:NOMBRE" y devuelve NOMBRE -> archivo NOMBRE.png junto a la plantilla."""
    imagenes = {}
    for nombre in sorted(set(re.findall(r'src="cid:([\w-]+)"', html))):
        archivo = plantilla.parent / f"{nombre}.png"
        if not archivo.exists():
            sys.exit(f"La plantilla usa cid:{nombre} pero no existe {archivo}")
        imagenes[nombre] = archivo
    return imagenes


def enviar(llave: str, para: str, asunto: str, html: str, imagenes: dict[str, Path],
           remitente: str, cabecera_baja: bool) -> str:
    cuerpo = {
        "from": remitente,
        "to": [para],
        "reply_to": RESPONDER_A,
        "subject": asunto,
        "html": html,
        "text": a_texto(html),
    }
    if cabecera_baja:
        cuerpo["headers"] = {"List-Unsubscribe": f"<mailto:{RESPONDER_A}?subject=BAJA>"}
    if imagenes:
        cuerpo["attachments"] = [
            {"filename": archivo.name, "content": base64.b64encode(archivo.read_bytes()).decode(), "content_id": nombre}
            for nombre, archivo in imagenes.items()
        ]
    pedido = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(cuerpo).encode(),
        headers={
            "Authorization": f"Bearer {llave}",
            "Content-Type": "application/json",
            "User-Agent": "eventalist-campanas/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(pedido, timeout=30) as respuesta:
            return json.load(respuesta)["id"]
    except urllib.error.HTTPError as error:
        sys.exit(f"Resend rechazó el envío a {para}: {error.code} {error.read().decode()}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("lista", help="CSV de expirados_sin_compra.py")
    parser.add_argument("--plantilla", required=True, help="HTML con {{codigo}}")
    parser.add_argument("--asunto", required=True, help="Asunto; también admite {{codigo}}")
    parser.add_argument("--grupo", choices=["si", "no", "todos"], required=True,
                        help="Filtra por la columna desde_fecha (si, no) o toma a todos")
    parser.add_argument("--previas", required=True, help="Carpeta donde dejar una vista previa HTML por persona")
    parser.add_argument("--registro", required=True, help="CSV con los envíos hechos (se crea si no existe)")
    parser.add_argument("--prueba", help="Mandar un solo correo de muestra a esta dirección en vez de a las personas")
    parser.add_argument("--enviar", action="store_true", help="Enviar de verdad (sin esto solo hay vistas previas)")
    parser.add_argument("--remitente", default=REMITENTE,
                        help=f'Nombre y correo del remitente (por defecto "{REMITENTE}")')
    parser.add_argument("--sin-cabecera-baja", action="store_true",
                        help="No agregar la cabecera List-Unsubscribe (la usan los envíos masivos; la baja sigue en el texto)")
    parser.add_argument("--ignorar-horario", action="store_true",
                        help="Enviar aunque sea fuera del horario de la Ley 2300 (decisión explícita del titular)")
    args = parser.parse_args()

    plantilla = Path(args.plantilla).read_text(encoding="utf-8")
    imagenes = imagenes_incrustadas(Path(args.plantilla), plantilla)
    nombre_plantilla = Path(args.plantilla).name
    with open(args.lista, encoding="utf-8-sig", newline="") as archivo:
        filas = list(csv.DictReader(archivo))
    if args.grupo != "todos":
        if filas and "desde_fecha" not in filas[0]:
            sys.exit("La lista no tiene la columna desde_fecha: correr expirados_sin_compra.py con --desde.")
        filas = [f for f in filas if f["desde_fecha"] == args.grupo]

    registro = Path(args.registro).expanduser()
    ya_enviados = set()
    if registro.exists():
        with open(registro, encoding="utf-8", newline="") as archivo:
            ya_enviados = {(r["correo"], r["plantilla"]) for r in csv.DictReader(archivo) if r["prueba"] == "no"}

    pendientes = []
    for fila in filas:
        if not fila["correo"]:
            print(f"Sin correo, se omite: {fila['pedidos']}")
            continue
        if (fila["correo"], nombre_plantilla) in ya_enviados and not args.prueba:
            print(f"Ya se le envió esta plantilla, se omite: {fila['correo']}")
            continue
        codigo = fila["pedidos"].split()[-1]
        pendientes.append((fila["correo"], codigo,
                           args.asunto.replace("{{codigo}}", codigo),
                           plantilla.replace("{{codigo}}", codigo)))

    previas = Path(args.previas).expanduser()
    previas.mkdir(parents=True, exist_ok=True)
    for correo, codigo, asunto, html in pendientes:
        vista = html
        for nombre, archivo in imagenes.items():
            vista = vista.replace(f"cid:{nombre}", archivo.resolve().as_uri())
        (previas / f"{codigo}.html").write_text(vista, encoding="utf-8")
    print(f"{len(pendientes)} correos listos. Vistas previas en {previas}")

    if not args.enviar:
        print("No se envió nada (falta --enviar).")
        return

    if args.prueba and pendientes:
        # Una sola muestra, con el código de un pedido real si lo hay.
        pendientes = [next((p for p in pendientes if p[1] != "PRUEBA"), pendientes[0])]

    motivo = horario_permitido(datetime.now(BOGOTA))
    if motivo and args.ignorar_horario:
        print(f"Aviso: {motivo}; se envía igual por --ignorar-horario.")
    elif motivo:
        sys.exit(f"No se envía: {motivo} (Ley 2300 de 2023).")
    llave = os.environ.get("RESEND_API_KEY")
    if not llave:
        sys.exit("Falta la variable de entorno RESEND_API_KEY.")

    nuevo = not registro.exists()
    with open(registro, "a", encoding="utf-8", newline="") as archivo:
        escritor = csv.writer(archivo)
        if nuevo:
            escritor.writerow(["fecha", "correo", "pedido", "plantilla", "prueba", "id_resend"])
        for correo, codigo, asunto, html in pendientes:
            destino = args.prueba or correo
            identificador = enviar(llave, destino, asunto, html, imagenes, args.remitente, not args.sin_cabecera_baja)
            escritor.writerow([datetime.now(BOGOTA).isoformat(timespec="seconds"), correo, codigo,
                               nombre_plantilla, "si" if args.prueba else "no", identificador])
            archivo.flush()
            print(f"Enviado a {destino} ({codigo}): {identificador}")
            time.sleep(0.6)  # Resend permite pocas solicitudes por segundo en el plan gratis


if __name__ == "__main__":
    main()
