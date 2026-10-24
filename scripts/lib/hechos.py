"""Hechos del evento para los scripts en Python, desde la exportación del build.

La fuente es src/data/ y src/config.ts; `npm run build` la exporta en
dist/datos/evento.json (src/pages/datos/evento.json.ts). Aquí solo se lee:
ningún script vuelve a escribir un precio, un slug o una URL del evento.
Si la exportación falta o es más vieja que la fuente, se detiene y pide el
build, para no trabajar con datos viejos.
"""

from __future__ import annotations

import json
import sys
from datetime import date
from functools import cache
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
EXPORTACION = RAIZ / "dist" / "datos" / "evento.json"
FUENTE = [RAIZ / "src" / "config.ts", *sorted((RAIZ / "src" / "data").glob("*.ts"))]


@cache
def leer() -> dict:
    if not EXPORTACION.exists():
        sys.exit(f"Falta {EXPORTACION.relative_to(RAIZ)}: correr `npm run build` en la raíz del repo.")
    exportado = EXPORTACION.stat().st_mtime
    cambiados = [p.relative_to(RAIZ) for p in FUENTE if p.stat().st_mtime > exportado]
    if cambiados:
        sys.exit(
            f"{EXPORTACION.relative_to(RAIZ)} es más viejo que {', '.join(map(str, cambiados))}: "
            "correr `npm run build` para no usar datos viejos."
        )
    return json.loads(EXPORTACION.read_text(encoding="utf-8"))


def pesos(valor: int) -> str:
    """340000 -> '$340.000', como se escribe en Colombia."""
    return "$" + f"{valor:,}".replace(",", ".")


def boleta(id_boleta: str) -> dict:
    for b in leer()["boletas"]:
        if b["id"] == id_boleta:
            return b
    sys.exit(f"La exportación no tiene la boleta {id_boleta}.")


def variables_plantilla() -> dict[str, str]:
    """Hechos que las plantillas usan como {{variable}}; la redacción queda en la plantilla."""
    medio_dia = {b["precio"] for b in leer()["boletas"] if b["mitad"]}
    if len(medio_dia) != 1:
        sys.exit(f"Las boletas de medio día no tienen un solo precio ({sorted(medio_dia)}): revisar las plantillas.")
    variables = {
        "precio_pase_completo": pesos(boleta("pase-completo")["precio"]),
        "precio_fin_de_semana": pesos(boleta("fin-de-semana")["precio"]),
        "precio_medio_dia": pesos(medio_dia.pop()),
        "precio_pase_completo_por_separado": pesos(boleta("pase-completo")["precioPorSeparado"]),
        "precio_fin_de_semana_por_separado": pesos(boleta("fin-de-semana")["precioPorSeparado"]),
    }
    # Solo mientras la etapa actual tenga fecha de fin: la última (etapa 3) no vence.
    fin = leer()["etapas"].get(f"stage{leer()['etapas']['actual']}End")
    if fin:
        variables["fin_etapa_actual"] = fecha_larga(fin)
    return variables


# Por qué falta una variable de hechos que una plantilla usa (el canal lo dice al detenerse).
SIN_VALOR = {
    "fin_etapa_actual": "la etapa actual no tiene fecha de fin, así que la plantilla ya no puede anunciar "
                        "hasta cuándo dura el descuento. Cambiar la plantilla antes de enviarla.",
}


def fecha_larga(iso: str) -> str:
    """'2026-10-29' -> 'jueves 29 de octubre'."""
    dia = date.fromisoformat(iso)
    dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre",
             "octubre", "noviembre", "diciembre"]
    return f"{dias[dia.weekday()]} {dia.day} de {meses[dia.month - 1]}"
