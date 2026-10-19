"""Un solo registro de envíos para todas las campañas, eventos y canales.

~/Documents/eventalist/datos/registro-envios.csv, fuera del repositorio. Con
él se evita repetir un mensaje y se cuentan los mensajes por persona entre
campañas (reglas.py). Cuando el backend tenga el registro central de envíos,
este archivo se importa allá y este módulo pasa a escribir en el backend.

tipo: real (una persona de la lista), titular (el equipo, recibe cada envío
real) o muestra (--prueba). Solo los reales cuentan para los límites.
"""

from __future__ import annotations

import csv
from dataclasses import asdict, dataclass, fields
from datetime import datetime

from comun import BOGOTA, DATOS

RUTA = DATOS / "registro-envios.csv"


@dataclass
class Envio:
    fecha: str  # ISO, hora de Bogotá
    campana: str
    evento: str
    canal: str  # correo | whatsapp
    plantilla: str
    correo: str
    whatsapp: str
    tipo: str  # real | titular | muestra
    estado: str  # enviado | fallido
    id_proveedor: str = ""
    detalle: str = ""

    def es_de(self, correo: str, whatsapp: str) -> bool:
        return bool((correo and self.correo == correo) or (whatsapp and self.whatsapp == whatsapp))


def leer() -> list[Envio]:
    if not RUTA.exists():
        return []
    with open(RUTA, encoding="utf-8", newline="") as archivo:
        return [Envio(**fila) for fila in csv.DictReader(archivo)]


def anotar(envio: Envio) -> None:
    nuevo = not RUTA.exists()
    RUTA.parent.mkdir(parents=True, exist_ok=True)
    with open(RUTA, "a", encoding="utf-8", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=[f.name for f in fields(Envio)])
        if nuevo:
            escritor.writeheader()
        escritor.writerow(asdict(envio))


def ahora() -> str:
    return datetime.now(BOGOTA).isoformat(timespec="seconds")
