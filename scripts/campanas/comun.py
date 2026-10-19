"""Lo que comparten todas las piezas: rutas, zona horaria, normalización y llaves.

Ningún módulo de las campañas guarda datos personales dentro del repositorio
(es público): las listas y el registro van a ~/Documents/eventalist/datos/.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import timedelta, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
CONFIG = AQUI / "config"
PLANTILLAS = AQUI / "plantillas"
# Contactos del equipo que reciben cada envío real (nombre,correo,telefono).
# Ignorado por git (*.local.csv) porque el repositorio es público.
INCLUIR = AQUI / "incluir.local.csv"
DATOS = Path.home() / "Documents" / "eventalist" / "datos"
BOGOTA = timezone(timedelta(hours=-5))  # Colombia no tiene horario de verano


def normalizar_correo(valor: str | None) -> str:
    return (valor or "").strip().lower()


def normalizar_telefono(valor: str | None) -> str:
    """Devuelve el número en formato E.164 (+57...) o "" si no hay número.

    Pretix antepone un apóstrofo para que Excel no lo trate como número.
    Un celular colombiano sin indicativo (10 dígitos que empiezan por 3)
    se completa con +57.
    """
    digitos = re.sub(r"\D", "", valor or "")
    if not digitos:
        return ""
    if len(digitos) == 10 and digitos.startswith("3"):
        digitos = "57" + digitos
    return "+" + digitos


def saludo(nombre: str | None) -> str:
    """'Hola, Ana.' con el primer nombre; 'Hola.' si no parece un nombre."""
    primero = ((nombre or "").split() or [""])[0].strip(".,;")
    if len(primero) < 2 or not re.fullmatch(r"[^\W\d_]+(-[^\W\d_]+)?", primero):
        return "Hola."
    if primero.islower() or primero.isupper():
        primero = "-".join(p.capitalize() for p in primero.split("-"))
    return f"Hola, {primero}."


def llave(variable: str, servicio: str | None = None) -> str:
    """Lee una llave de la variable de entorno o, si no está, del llavero de macOS."""
    valor = os.environ.get(variable)
    if valor:
        return valor
    if servicio:
        try:
            return subprocess.run(
                ["security", "find-generic-password", "-s", servicio, "-w"],
                capture_output=True, text=True, check=True,
            ).stdout.strip()
        except (FileNotFoundError, subprocess.CalledProcessError):
            sys.exit(
                f"Falta la llave {variable}: guardarla una vez con\n"
                f"  security add-generic-password -a \"$USER\" -s {servicio} -w\n"
                f"o ponerla en la variable {variable}."
            )
    sys.exit(f"Falta la variable de entorno {variable}.")


def pedir_json(url: str, cabeceras: dict[str, str], servicio: str) -> dict:
    """GET de solo lectura: tres intentos ante fallas de red o errores 5xx del servidor;
    un error 4xx (token, permisos, nombre equivocado) se reporta de una vez."""
    for intento in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=cabeceras), timeout=30) as respuesta:
                return json.load(respuesta)
        except urllib.error.HTTPError as error:
            if error.code < 500:
                sys.exit(f"{servicio} respondió {error.code}: {error.read().decode()[:300]}")
            falla = f"error {error.code} del servidor"
        except (urllib.error.URLError, TimeoutError) as error:
            falla = str(error)
        if intento == 2:
            sys.exit(f"{servicio} falló tres veces seguidas ({falla}). Esperar un rato y repetir.")
        time.sleep(5)
    raise AssertionError("inalcanzable")
