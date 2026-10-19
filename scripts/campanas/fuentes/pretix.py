"""Fuente: pedidos de un evento en la API de Pretix (solo lectura).

Token del equipo `lectura-campanas` (solo "Puede ver pedidos"), en la
variable PRETIX_TOKEN o en el llavero, servicio "eventalist-pretix".
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from datetime import datetime

from comun import BOGOTA, llave, pedir_json, normalizar_correo, normalizar_telefono

PRETIX = "https://pretix.eventalist.co"
ORGANIZADOR = "eventalist"
ESTADOS = {"n": "pendiente", "p": "pagado", "e": "expirado", "c": "cancelado"}
COMPRO = {"pagado", "pendiente"}


@dataclass
class Pedido:
    codigo: str
    estado: str
    correo: str
    telefono: str
    creado: datetime  # hora de Bogotá
    total: str
    boletas: int
    asistente: str  # nombre del primer asistente; puede no ser quien compra


def leer_pedidos(evento: str) -> list[Pedido]:
    """Todos los pedidos reales del evento (sin modo prueba), página por página."""
    token = llave("PRETIX_TOKEN", "eventalist-pretix")
    url = f"{PRETIX}/api/v1/organizers/{ORGANIZADOR}/events/{evento}/orders/?testmode=false"
    pedidos = []
    while url:
        pagina = pedir_json(url, {"Authorization": f"Token {token}"}, f"Pretix (pedidos de {evento})")
        for orden in pagina["results"]:
            estado = ESTADOS.get(orden["status"])
            if not estado:
                sys.exit(f"Estado desconocido en el pedido {orden['code']}: {orden['status']!r}. Revisar antes de seguir.")
            pedidos.append(Pedido(
                codigo=orden["code"],
                estado=estado,
                correo=normalizar_correo(orden.get("email")),
                telefono=normalizar_telefono(orden.get("phone")),
                creado=datetime.fromisoformat(orden["datetime"]).astimezone(BOGOTA),
                total=str(orden["total"]).replace(".", ","),
                boletas=len(orden.get("positions") or []),
                asistente=next((p.get("attendee_name") or "" for p in orden.get("positions") or []), ""),
            ))
        url = pagina["next"]
    if not pedidos:
        sys.exit(f"Pretix no devolvió pedidos para {evento}. Revisar el nombre del evento y los permisos del token.")
    return pedidos


def datos_de(pedidos: list[Pedido], estados: set[str]) -> set[str]:
    """Correos y teléfonos de los pedidos en esos estados."""
    return {p.correo for p in pedidos if p.estado in estados and p.correo} | {
        p.telefono for p in pedidos if p.estado in estados and p.telefono
    }
