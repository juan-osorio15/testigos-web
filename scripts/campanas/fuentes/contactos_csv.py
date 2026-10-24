"""Fuente: contactos exportados de Google Contacts (CSV), por ejemplo la agenda de una persona.

Los archivos van fuera del repositorio (es público), en
~/Documents/eventalist/datos/<evento>/<carpeta>/, para borrarlos todos juntos
cuando ya no se usen. Devuelve un registro por correo (columnas "E-mail N - Value",
que pueden traer varios separados por " ::: "), con el nombre de la fila.
"""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path

from comun import normalizar_correo

CORREO_VALIDO = re.compile(r"[^@\s]+@[^@\s]+\.[a-z]{2,}")


@dataclass
class ContactoCsv:
    nombre: str
    correo: str


def leer_contactos(carpeta: Path) -> list[ContactoCsv]:
    archivos = sorted(carpeta.glob("*.csv"))
    if not archivos:
        raise SystemExit(f"No hay archivos .csv en {carpeta}.")
    contactos = []
    for archivo in archivos:
        with open(archivo, encoding="utf-8-sig", newline="") as abierto:
            for fila in csv.DictReader(abierto):
                nombre = " ".join(fila.get(k, "").strip() for k in ("First Name", "Last Name")).strip()
                for columna, valor in fila.items():
                    if not (columna and columna.startswith("E-mail") and columna.endswith("Value")):
                        continue
                    for correo in (valor or "").split(":::"):
                        correo = normalizar_correo(correo)
                        if CORREO_VALIDO.fullmatch(correo):
                            contactos.append(ContactoCsv(nombre, correo))
    return contactos
