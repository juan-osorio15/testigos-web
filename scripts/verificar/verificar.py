"""Comprobación de vigencia: coteja con la fuente los textos que se pegan o se envían.

El sitio toma sus hechos de src/data/ y src/config.ts; lo que se pega a mano
(Pretix, el chatbot, WhatsApp, Google Ads) y las plantillas de correo no.
Este script lee la exportación del build (dist/datos/evento.json) y busca en
esas piezas los errores que ya pasaron: precios que no existen, fechas de
etapa vencidas, nombres mal escritos, términos retirados, enlaces viejos. A la
ficha del chatbot, además, le coteja la programación: cada conversatorio con
su hora y sus panelistas.

Uso (en la raíz del repo, después de `npm run build`):
    python3 scripts/verificar/verificar.py           revisa las piezas vigentes
    python3 scripts/verificar/verificar.py ARCHIVO   revisa solo ese archivo
    python3 scripts/verificar/verificar.py --casos   comprueba que cada error histórico se detecta

Qué se revisa de cada pieza: de un .md, solo el texto para pegar (los bloques
de código sin lenguaje o en `markdown`, en la columna 0); las notas alrededor
pueden hablar de precios viejos o de franjas. De un .html, todo
menos los comentarios. La ficha y el prompt del chatbot (docs/chatbot/) se
pegan enteros.

Sale con código 1 si encuentra algo. campana.py lo corre sobre el correo ya
lleno antes de la vista previa y del envío.

La lista de patrones es corta a propósito: cada vez que un error se cuela,
se agrega aquí su patrón y su caso.
"""

from __future__ import annotations

import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path

sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))

from hechos import RAIZ, leer  # noqa: E402

MESES = {"septiembre": 9, "octubre": 10, "noviembre": 11}


def vigentes() -> list[Path]:
    """Las piezas que hoy se pegan o se envían. Del chatbot, solo la versión más alta de cada archivo."""
    docs = RAIZ / "docs"
    piezas = [
        *sorted((RAIZ / "scripts" / "campanas" / "plantillas").glob("*.html")),
        docs / "pretix" / "pretix-tienda-textos.md",
        *sorted((docs / "campanas" / "whatsapp").glob("*/README.md")),
        docs / "campanas" / "whatsapp-ventas" / "plantillas.md",
        docs / "campanas" / "google-ads" / "plan.md",
    ]
    for prefijo in ("ficha_", "prompt_"):
        versiones = sorted((docs / "chatbot").glob(f"{prefijo}*.md"), key=lambda p: int(re.findall(r"\d+", p.stem)[-1]))
        piezas += versiones[-1:]
    return [p for p in piezas if p.exists()]


@dataclass
class Hallazgo:
    linea: int
    regla: str
    texto: str


def para_pegar(ruta: Path, texto: str) -> list[tuple[int, str]]:
    """Las líneas de la pieza que llegan a alguien, con su número (ver arriba)."""
    if ruta.suffix == ".html":
        sin_comentarios = re.sub(r"<!--.*?-->", lambda m: "\n" * m.group(0).count("\n"), texto, flags=re.S)
        return list(enumerate(sin_comentarios.splitlines(), start=1))
    if "chatbot" in ruta.parts:
        return list(enumerate(texto.splitlines(), start=1))
    lineas, bloque = [], None  # None: fuera de un bloque; True/False: dentro, para pegar o no
    for numero, linea in enumerate(texto.splitlines(), start=1):
        if bloque is None and linea.startswith("```"):
            bloque = linea[3:].strip() in ("", "markdown", "text")
        elif bloque is not None and linea.strip() == "```":
            bloque = None
        elif bloque:
            lineas.append((numero, linea))
    return lineas


def revisar(texto: str, hechos: dict, publico: bool = True, lineas: list[tuple[int, str]] | None = None) -> list[Hallazgo]:
    """Hallazgos en un texto. `publico`: lo lee el comprador tal cual (no el chatbot, que lo interpreta)."""
    if lineas is None:
        lineas = list(enumerate(texto.splitlines(), start=1))
    hoy = date.fromisoformat(hechos["generado"])
    precios = {b["precio"] for b in hechos["boletas"]} | {
        b["precioPorSeparado"] for b in hechos["boletas"] if b["precioPorSeparado"]
    }
    whatsapp = hechos["contacto"]["whatsapp"]
    nombres = {p["nombre"] for p in hechos["panelistas"]}
    reglas: list[tuple[str, re.Pattern[str], callable]] = [
        ("precio que no es ninguno vigente", re.compile(r"\$?\b(\d{2,3})\.000\b"),
         lambda m: int(m.group(1)) * 1000 not in precios),
        ("enlace sin https", re.compile(r"\bhttp://[^\s)\"'<]+"), lambda m: True),
        ("WhatsApp distinto del vigente", re.compile(r"https://wa\.me/[^\s)\"'<]+"),
         lambda m: not m.group(0).startswith(whatsapp)),
        ("el pase no es de cuatro días",
         re.compile(r"pase[^.\n]{0,60}cuatro días|cuatro días[^.\n]{0,60}\bpase", re.I), lambda m: True),
        ("cada medio día no tiene el mismo número de conversatorios",
         re.compile(r"cada (?:franja|boleta de medio día|medio día)[^.\n]{0,50}\b(?:dos|tres|2|3) conversatorios", re.I),
         lambda m: True),
        ("charlas abiertas, no talleres", re.compile(r"\btaller(?:es)? de periodismo", re.I), lambda m: True),
        # Una pregunta sin su ¿: el tramo desde el último punto hasta el ? no lo trae. Los ? de las URL
        # van pegados a la consulta, así que solo cuenta el que cierra (seguido de espacio o fin).
        ("pregunta sin '¿' de apertura", re.compile(r"(?:^|(?<=[.!?]))[^.!?¿\n]*[^\W\d_][^.!?¿\n]*\?(?=[\s\"”)*]|$)"),
         lambda m: "://" not in m.group(0)),
        ("nombre de panelista mal escrito",
         re.compile(r"\bMartha Ruiz\b|\bMarta Soto\b|Echeverry|Ana Maria Echeverri|Guillermo Gonzalez\b"),
         lambda m: m.group(0) not in nombres),
    ]
    if publico:
        # El chatbot sí cuenta etapas pasadas ("Etapa 1, hasta el 12 de octubre. Ya terminó").
        reglas.append(("fecha de etapa vencida",
                       re.compile(r"hasta el (?:\w+ )?(\d{1,2}) de (septiembre|octubre|noviembre)", re.I),
                       lambda m: date(2026, MESES[m.group(2).lower()], int(m.group(1))) < hoy))
        reglas.append(("'franja' es nombre interno: boleta de medio día", re.compile(r"\bfranjas?\b", re.I),
                       lambda m: True))
    hallazgos = []
    for numero, linea in lineas:
        for nombre, patron, aplica in reglas:
            for m in patron.finditer(linea):
                if aplica(m):
                    hallazgos.append(Hallazgo(numero, nombre, m.group(0)))
    return hallazgos


def revisar_ficha(texto: str, hechos: dict) -> list[Hallazgo]:
    """La ficha del chatbot cuenta la programación: cada conversatorio en una línea, con su hora y
    sus panelistas como en la fuente, y todos los panelistas nombrados."""
    lineas = texto.splitlines()
    hallazgos = [Hallazgo(0, "ficha sin este panelista", p["nombre"])
                 for p in hechos["panelistas"] if p["nombre"] not in texto]
    for sesion in hechos["sesiones"]:
        if sesion["tipo"] != "conversatorio":
            continue
        numero, linea = next(((n, l) for n, l in enumerate(lineas, start=1) if sesion["titulo"] in l), (0, ""))
        if not linea:
            hallazgos.append(Hallazgo(0, "ficha sin esta sesión", sesion["titulo"]))
            continue
        hora = (sesion["hora"] or "").replace(" – ", " a ")
        if hora not in linea:
            hallazgos.append(Hallazgo(numero, f"la hora no es {hora}", sesion["titulo"]))
        for nombre in sesion["panelistas"]:
            if nombre not in linea:
                hallazgos.append(Hallazgo(numero, f"falta {nombre} en", sesion["titulo"]))
    return hallazgos


def revisar_correo(asunto: str, html: str, hechos: dict) -> list[Hallazgo]:
    """Un correo ya lleno, como sale (sin comentarios HTML)."""
    texto = f"{asunto}\n{html}"
    return revisar(texto, hechos, lineas=para_pegar(Path("correo.html"), texto))


def es_publico(ruta: Path) -> bool:
    """El chatbot lee su ficha y su prompt: ahí 'franja' es interno, no texto al comprador."""
    return "chatbot" not in ruta.parts


# Errores que ya llegaron al público (diagnóstico de specs/004): cada uno debe detectarse.
CASOS = [
    ("Pase completo a $310.000 hasta el 12 de octubre.", "precio que no es ninguno vigente"),
    ("El pase completo te da los cuatro días del encuentro.", "el pase no es de cuatro días"),
    ("Cada franja reúne dos conversatorios.", "cada medio día no tiene el mismo número de conversatorios"),
    ("Escríbenos: https://wa.me/message/CIRY6GT77KJOA1", "WhatsApp distinto del vigente"),
    ("Compra en http://testigosdelamemoria.com", "enlace sin https"),
    ("Con Martha Ruiz y Guillermo González Uribe.", "nombre de panelista mal escrito"),
    ("Talleres de periodismo gratis el jueves.", "charlas abiertas, no talleres"),
    ("Precio especial hasta el lunes 12 de octubre.", "fecha de etapa vencida"),
    ("Preguntas? Escríbannos:", "pregunta sin '¿' de apertura"),
]


def probar_casos(hechos: dict) -> int:
    fallas = 0
    for texto, regla in CASOS:
        if not any(h.regla == regla for h in revisar(texto, hechos)):
            print(f"NO SE DETECTA ({regla}): {texto}")
            fallas += 1
    print(f"{len(CASOS) - fallas} de {len(CASOS)} errores históricos detectados.")
    return 1 if fallas else 0


def main() -> int:
    hechos = leer()
    argumentos = sys.argv[1:]
    if argumentos == ["--casos"]:
        return probar_casos(hechos)
    piezas = [Path(a).resolve() for a in argumentos] or vigentes()
    total = 0
    for ruta in piezas:
        texto = ruta.read_text(encoding="utf-8")
        hallazgos = revisar(texto, hechos, publico=es_publico(ruta), lineas=para_pegar(ruta, texto))
        if ruta.name.startswith("ficha_"):
            hallazgos += revisar_ficha(texto, hechos)
        for h in hallazgos:
            nombre = ruta.relative_to(RAIZ) if ruta.is_relative_to(RAIZ) else ruta
            print(f"{nombre}:{h.linea}: {h.regla}: {h.texto}")
            total += 1
    print(f"{len(piezas)} piezas revisadas, {total} hallazgos.")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
