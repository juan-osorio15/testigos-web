"""Fuente: contactos de una campaña en el backend de Eventalist (solo lectura).

GET /api/v1/marketing/campaigns/<slug>/contacts/, en producción desde el
2026-10-19 (contrato en docs/campanas/README.md). Token de lectura
en la variable BACKEND_TOKEN o en el llavero, servicio
"eventalist-backend-lectura". El token de Pretix no sirve aquí.
"""

from __future__ import annotations

import urllib.parse
from dataclasses import dataclass
from datetime import datetime

from comun import BOGOTA, llave, pedir_json, normalizar_correo, normalizar_telefono
from hechos import leer as hechos

# Etapas de compra en la campaña (CampaignMembership.stage) de quien ya pagó o tiene un pedido vivo.
ETAPAS_CON_PEDIDO = {"order_pending", "purchased"}


@dataclass
class Contacto:
    nombre: str
    correo: str
    telefono: str
    origen: str  # fuente del primer contacto de la persona, no la de esta campaña
    inscrito: datetime  # hora de Bogotá
    etapa: str
    correo_ok: bool  # autorización vigente para la campaña, activo y sin baja de correo
    whatsapp_ok: bool


def leer_contactos(campana: str, origen: str | None = None, etapa: str | None = None) -> list[Contacto]:
    token = llave("BACKEND_TOKEN", "eventalist-backend-lectura")
    filtros = {k: v for k, v in {"source": origen, "stage": etapa}.items() if v}
    url = f"{hechos()['integraciones']['backend']}/api/v1/marketing/campaigns/{campana}/contacts/"
    if filtros:
        url += "?" + urllib.parse.urlencode(filtros)
    contactos = []
    while url:
        pagina = pedir_json(url, {"Authorization": f"Bearer {token}"}, f"El backend (contactos de {campana})")
        for c in pagina["results"]:
            contactos.append(Contacto(
                nombre=c["first_name"] or "",
                correo=normalizar_correo(c["email"]),
                telefono=normalizar_telefono(c["phone"]),
                origen=c["source"],
                inscrito=datetime.fromisoformat(c["joined_at"]).astimezone(BOGOTA),
                etapa=c["stage"],
                correo_ok=bool(c["email_reachable"]),
                whatsapp_ok=bool(c["whatsapp_reachable"]),
            ))
        url = pagina["next"]
    return contactos
