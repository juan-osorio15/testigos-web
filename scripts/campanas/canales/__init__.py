"""Canales: solo envían. Reciben destinatarios en el formato único y la configuración del canal.

Cada canal expone:
- dato(destinatario): el correo o el número; vacío = no se le escribe por aquí.
- preparar(destinatarios): un Mensaje por persona, o se detiene si la
  plantilla usa algo que la lista no trae.
- mostrar(mensajes): la vista previa, sin enviar nada.
- enviar(mensaje, destino): devuelve el id del proveedor o lanza ErrorCanal.

Las reglas (horario, repetidos, límites) y el registro los aplica
campana.py, igual para todos los canales.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from lista import Destinatario


class ErrorCanal(Exception):
    def __init__(self, mensaje: str, fatal: bool):
        super().__init__(mensaje)
        # fatal: el problema no es de la persona sino de la llave, la plantilla o el límite: no seguir.
        self.fatal = fatal


@dataclass
class Mensaje:
    destinatario: Destinatario
    contenido: object  # lo que el canal necesita para enviar (HTML y asunto, parámetros de la plantilla)


class Canal(Protocol):
    nombre: str
    plantilla: str

    def dato(self, d: Destinatario) -> str: ...
    def preparar(self, destinatarios: list[Destinatario]) -> list[Mensaje]: ...
    def mostrar(self, mensajes: list[Mensaje]) -> None: ...
    def enviar(self, mensaje: Mensaje, destino: str) -> str: ...


def canal(nombre: str, config: dict, carpeta_previas) -> Canal:
    if nombre == "correo":
        from canales.correo import Correo

        return Correo(config, carpeta_previas)
    if nombre == "whatsapp":
        from canales.whatsapp import WhatsApp

        return WhatsApp(config)
    raise SystemExit(f"Canal desconocido: {nombre}.")
