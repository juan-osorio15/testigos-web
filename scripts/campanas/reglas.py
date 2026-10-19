"""Reglas que valen para toda campaña y todo canal (Ley 2300 de 2023 y dictámenes del abogado).

- Horario: lunes a viernes de 7:00 a 19:00 y sábados de 8:00 a 15:00, hora
  de Bogotá; nunca domingos ni festivos.
- Un mismo mensaje (campaña, canal y plantilla) no se repite. Una plantilla
  nueva en la misma campaña es otro mensaje.
- Sin límite de mensajes por persona ni por día, por decisión del titular
  (2026-10-19: se escribe por todos los canales). Una campaña puede ponerse
  límites en su configuración: "reglas": {"maximo_por_persona": 2,
  "uno_por_dia": true}. El límite de dos venía del dictamen del abogado del
  2026-10-12.

Las bajas no viven aquí: las decide la fuente (el backend) y la audiencia
deja vacío el canal cerrado.
"""

from __future__ import annotations

from datetime import datetime

from lista import Destinatario
from registro import Envio

# Festivos de Colombia. Agregar el año siguiente antes de enviar en él.
FESTIVOS = {
    "2026-01-01", "2026-01-12", "2026-03-23", "2026-04-02", "2026-04-03",
    "2026-05-01", "2026-05-18", "2026-06-08", "2026-06-15", "2026-06-29",
    "2026-07-20", "2026-08-07", "2026-08-17", "2026-10-12", "2026-11-02",
    "2026-11-16", "2026-12-08", "2026-12-25",
}


def motivo_fuera_de_horario(momento: datetime) -> str | None:
    """Devuelve el motivo si no se puede enviar en ese momento, o None si se puede."""
    dia = momento.date()
    if str(dia.year) not in {f[:4] for f in FESTIVOS}:
        return f"no hay festivos cargados para {dia.year}"
    if dia.isoformat() in FESTIVOS:
        return "hoy es festivo"
    hora = momento.hour + momento.minute / 60
    if momento.weekday() == 6:
        return "hoy es domingo"
    if momento.weekday() == 5 and not 8 <= hora < 15:
        return "los sábados solo de 8:00 a 15:00"
    if momento.weekday() < 5 and not 7 <= hora < 19:
        return "entre semana solo de 7:00 a 19:00"
    return None


def motivo_para_no_enviar(d: Destinatario, campana: str, canal: str, plantilla: str, envios: list[Envio],
                          hoy: str, maximo: int | None = None, uno_por_dia: bool = False) -> str | None:
    """Por qué no se le escribe a esta persona por este canal, o None si se puede."""
    suyos = [e for e in envios if e.estado == "enviado" and e.es_de(d.correo, d.whatsapp)]
    if any(e.campana == campana and e.canal == canal and e.plantilla == plantilla and e.tipo == d.tipo for e in suyos):
        return "ya recibió este mensaje"
    if d.tipo == "titular":
        return None
    reales = [e for e in suyos if e.tipo == "real"]
    if maximo is not None and len(reales) >= maximo:
        return f"ya recibió {len(reales)} mensajes (máximo {maximo})"
    if uno_por_dia and any(e.fecha.startswith(hoy) for e in reales):
        return "ya recibió un mensaje hoy"
    return None
