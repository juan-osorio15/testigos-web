#!/usr/bin/env python3
"""Personas que pidieron aviso de venta en el sitio y todavía no han comprado.

Lee los contactos de una campaña del backend de Eventalist (los que llegaron
por el formulario del sitio: el modal "Avísame" de las franjas y, antes de la
tienda, la lista de interesados) y los cruza con los pedidos de Pretix. Sale
una fila por persona que no tiene ningún pedido pagado, pendiente ni
expirado. A quien expiró ya le escribió la campaña de expirados.

Los contactos salen de una de dos fuentes:
- API del backend (--campana): GET /api/v1/marketing/campaigns/<slug>/contacts/
  con el token de lectura de la variable BACKEND_TOKEN o del llavero de macOS
  (servicio "eventalist-backend-lectura"). Contrato en
  docs/campana-interesados/prompt-backend.md.
- Exportación CSV del admin de Django (--csv), mientras el endpoint no exista.

Uso:
    python3 scripts/backend/interesados_sin_compra.py --campana testigos-de-la-memoria-2026 \
        --evento testigos-memoria [--desde 2026-09-09] [--excluir correo@x.co]
    python3 scripts/backend/interesados_sin_compra.py --csv contacts-....csv --evento testigos-memoria

--desde (por defecto 2026-09-09, el día en que la tienda quedó en la portada)
deja solo a quien se inscribió desde esa fecha: el modal de las franjas. Con
una fecha anterior entra también la lista de interesados de la preventa.

Quien se dio de baja de un canal en el backend queda sin ese dato (correo o
WhatsApp vacío); si se dio de baja de los dos, no sale. La lista queda en
~/Documents/eventalist/datos/<evento>/interesados-<fecha-hora>.csv, fuera de
cualquier repositorio, con la columna "saludo" ("Hola, Ana." o "Hola.") para
la plantilla de correo. Los contactos de scripts/pretix/incluir.local.csv se
agregan al final con prueba = si.

Solo usa la biblioteca estándar.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "pretix"))
from expirados_sin_compra import (  # noqa: E402  (un solo lugar para Pretix y la normalización)
    BOGOTA, COMPRO, DATOS, EXPIRO, INCLUIR, leer_pedidos_api, normalizar_correo, normalizar_telefono,
)

BACKEND = "https://eventalist-backend-production.up.railway.app"
LLAVERO = "eventalist-backend-lectura"
FECHA_TIENDA = "2026-09-09"  # src/data/event.ts, validFrom del pase completo
ORIGEN_FORMULARIO = "website"
# Etapas del backend (CampaignMembership.stage) de quien ya hizo algún pedido.
ETAPAS_CON_PEDIDO = {"order_pending", "purchased"}


def token_backend() -> str:
    token = os.environ.get("BACKEND_TOKEN")
    if token:
        return token
    try:
        return subprocess.run(
            ["security", "find-generic-password", "-s", LLAVERO, "-w"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
    except (FileNotFoundError, subprocess.CalledProcessError):
        sys.exit(
            "Falta el token de lectura del backend: guardarlo una vez con\n"
            f"  security add-generic-password -a \"$USER\" -s {LLAVERO} -w\n"
            "o ponerlo en la variable BACKEND_TOKEN."
        )


def leer_contactos_api(campana: str) -> list[dict]:
    """Contactos del formulario en la campaña, página por página (contrato del prompt al backend)."""
    token = token_backend()
    consulta = urllib.parse.urlencode({"source": ORIGEN_FORMULARIO})
    url = f"{BACKEND}/api/v1/marketing/campaigns/{campana}/contacts/?{consulta}"
    contactos = []
    while url:
        pedido = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
        try:
            with urllib.request.urlopen(pedido, timeout=30) as respuesta:
                pagina = json.load(respuesta)
        except urllib.error.HTTPError as error:
            sys.exit(f"El backend respondió {error.code} al pedir los contactos de {campana}: {error.read().decode()[:300]}")
        for c in pagina["results"]:
            contactos.append({
                "nombre": c.get("first_name") or "",
                "correo": normalizar_correo(c.get("email") or ""),
                "telefono": normalizar_telefono(c.get("phone") or ""),
                "inscrito": datetime.fromisoformat(c["joined_at"]).astimezone(BOGOTA).strftime("%Y-%m-%d %H:%M"),
                "etapa": c["stage"],
                "correo_ok": bool(c["email_reachable"]),
                "whatsapp_ok": bool(c["whatsapp_reachable"]),
            })
        url = pagina["next"]
    return contactos


def leer_contactos_csv(ruta: str, campana: str) -> list[dict]:
    """Exportación del admin (Marketing contacts → acción de exportar, filtrada por la campaña)."""
    with open(ruta, encoding="utf-8-sig", newline="") as archivo:
        filas = list(csv.DictReader(archivo))
    if not filas:
        sys.exit("La exportación está vacía.")
    faltan = {"first_name", "email", "phone", "campaigns", "source", "email_consent",
              "whatsapp_consent", "date_added", "campaign_stage"} - set(filas[0])
    if faltan:
        sys.exit(f"La exportación no tiene estas columnas: {', '.join(sorted(faltan))}. "
                 "Exportar desde el admin filtrando por la campaña.")
    contactos = []
    for f in filas:
        if f["source"] != ORIGEN_FORMULARIO or campana not in f["campaigns"].split(";"):
            continue
        contactos.append({
            "nombre": f["first_name"].lstrip("'"),
            "correo": normalizar_correo(f["email"]),
            "telefono": normalizar_telefono(f["phone"]),
            # El CSV solo trae la fecha en que se creó el contacto, sin hora.
            "inscrito": f["date_added"],
            "etapa": f["campaign_stage"],
            "correo_ok": f["email_consent"] == "yes",
            "whatsapp_ok": f["whatsapp_consent"] == "yes",
        })
    return contactos


def saludo(nombre: str) -> str:
    """'Hola, Ana.' con el primer nombre tal como se escribe; 'Hola.' si no parece un nombre."""
    primero = (nombre.split() or [""])[0].strip(".,;")
    if len(primero) < 2 or not re.fullmatch(r"[^\W\d_]+(-[^\W\d_]+)?", primero):
        return "Hola."
    if primero.islower() or primero.isupper():
        primero = "-".join(p.capitalize() for p in primero.split("-"))
    return f"Hola, {primero}."


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--campana", default="testigos-de-la-memoria-2026",
                        help="Slug de la campaña en el backend (el de src/config.ts)")
    parser.add_argument("--csv", help="Exportación del admin del backend, en vez de la API")
    parser.add_argument("--evento", required=True, help="Slug del evento en Pretix, para descartar a quien ya hizo pedidos")
    parser.add_argument("--desde", default=FECHA_TIENDA,
                        help=f"Solo inscritos desde esta fecha AAAA-MM-DD (por defecto {FECHA_TIENDA}: el modal de las franjas)")
    parser.add_argument("-o", "--salida",
                        help="CSV de salida (por defecto ~/Documents/eventalist/datos/<evento>/interesados-<fecha-hora>.csv)")
    parser.add_argument("--excluir", action="append", default=[],
                        help="Correo o teléfono a dejar por fuera (equipo, pruebas). Se puede repetir.")
    args = parser.parse_args()
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", args.desde):
        sys.exit("--desde debe tener el formato AAAA-MM-DD.")

    contactos = leer_contactos_csv(args.csv, args.campana) if args.csv else leer_contactos_api(args.campana)
    if not contactos:
        sys.exit(f"No hay contactos del formulario en la campaña {args.campana}. Revisar el slug.")
    pedidos = leer_pedidos_api(args.evento)

    # Datos de quien ya pagó, tiene un pedido pendiente o dejó expirar uno.
    con_pedido = {p.correo for p in pedidos if p.estado in COMPRO | EXPIRO and p.correo} | {
        p.telefono for p in pedidos if p.estado in COMPRO | EXPIRO and p.telefono
    }
    excluidos = {normalizar_correo(x) for x in args.excluir} | {
        normalizar_telefono(x) for x in args.excluir if re.search(r"\d", x)
    }

    filas = []
    antes = compraron = de_baja = a_mano = 0
    for c in contactos:
        datos = {c["correo"], c["telefono"]} - {""}
        if c["inscrito"][:10] < args.desde:
            antes += 1
        elif c["etapa"] in ETAPAS_CON_PEDIDO or datos & con_pedido:
            compraron += 1
        elif datos & excluidos:
            a_mano += 1
        elif not (c["correo_ok"] and c["correo"]) and not (c["whatsapp_ok"] and c["telefono"]):
            de_baja += 1
        else:
            telefono = c["telefono"] if c["whatsapp_ok"] else ""
            filas.append({
                "saludo": saludo(c["nombre"]),
                "nombre": c["nombre"],
                "correo": c["correo"] if c["correo_ok"] else "",
                "telefono": telefono,
                "whatsapp": telefono.lstrip("+"),
                "inscrito": c["inscrito"],
                "prueba": "no",
            })
    filas.sort(key=lambda f: f["inscrito"])

    # Comprobación de seguridad: nadie de la salida comparte correo o teléfono con un pedido.
    for f in filas:
        choque = {f["correo"], f["telefono"]} & con_pedido
        assert not choque, f"Error interno: {choque} tiene pedidos y quedó en la lista"

    pruebas = 0
    if INCLUIR.exists():
        with open(INCLUIR, encoding="utf-8-sig", newline="") as archivo:
            for contacto in csv.DictReader(archivo):
                correo = normalizar_correo(contacto["correo"])
                telefono = normalizar_telefono(contacto["telefono"])
                filas = [f for f in filas if f["correo"] != correo and f["telefono"] != telefono]
                filas.append({
                    "saludo": saludo(contacto.get("nombre", "")),
                    "nombre": contacto.get("nombre", ""),
                    "correo": correo,
                    "telefono": telefono,
                    "whatsapp": telefono.lstrip("+"),
                    "inscrito": "",
                    "prueba": "si",
                })
                pruebas += 1

    if args.salida:
        salida = Path(args.salida).expanduser()
    else:
        salida = DATOS / args.evento / f"interesados-{datetime.now(BOGOTA):%Y-%m-%d-%H%M}.csv"
        salida.parent.mkdir(parents=True, exist_ok=True)
    campos = ["saludo", "nombre", "correo", "telefono", "whatsapp", "inscrito", "prueba"]
    with open(salida, "w", encoding="utf-8-sig", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=campos)
        escritor.writeheader()
        escritor.writerows(filas)

    reales = [f for f in filas if f["prueba"] == "no"]
    print(f"Contactos del formulario en {args.campana}: {len(contactos)} · pedidos de Pretix leídos: {len(pedidos)}")
    print(f"Inscritos antes del {args.desde} (preventa, fuera de esta lista): {antes}")
    print(f"Ya pagaron, tienen un pedido pendiente o uno expirado (no se contactan aquí): {compraron}")
    if args.excluir:
        print(f"Excluidos a mano (--excluir): {a_mano}")
    print(f"Dados de baja de correo y de WhatsApp: {de_baja}")
    print(f"Personas a contactar: {len(reales)} -> {salida}")
    print(f"  Con correo: {sum(1 for f in reales if f['correo'])} · con WhatsApp: {sum(1 for f in reales if f['whatsapp'])}")
    if pruebas:
        print(f"  Más {pruebas} contacto(s) de prueba de {INCLUIR.name} (columna prueba = si)")


if __name__ == "__main__":
    main()
