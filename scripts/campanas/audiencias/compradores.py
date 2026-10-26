"""Quien tiene al menos un pedido pagado en Pretix.

No es una lista para escribirle a nadie: sirve para marcar a los compradores
como Customer en respond.io, así los broadcasts de RC (que excluyen a los
Customer) no les llegan. Por eso el teléfono va sin mirar la autorización de
WhatsApp, y la configuración no tiene canales.

- Une los pedidos por persona (correo o teléfono). Un pedido pendiente no
  cuenta: todavía no pagó.
- Van todos los teléfonos y el correo más reciente de cada persona, para que
  respond.io la reconozca con el número con que escribió a Catalina.
"""

from __future__ import annotations

from audiencias import Resultado
from fuentes import pretix
from lista import Destinatario
from personas import agrupar


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    pedidos = pretix.leer_pedidos(evento)
    destinatarios = []
    personas = sin_telefono = 0
    for grupo in agrupar(pedidos):
        pagados = sorted((p for p in grupo if p.estado == "pagado"), key=lambda p: p.creado)
        if not pagados:
            continue
        personas += 1
        telefonos = sorted({p.telefono for p in grupo if p.telefono})
        if not telefonos:
            sin_telefono += 1
            continue
        correo = next((p.correo for p in reversed(pagados) if p.correo), "")
        # Una fila por teléfono: si pagó con un número y escribió a Catalina con otro, los dos quedan marcados.
        for telefono in telefonos:
            destinatarios.append(Destinatario(
                saludo="", nombre="", correo=correo, whatsapp=telefono.lstrip("+"),
                detalle={"pedidos": " ".join(p.codigo for p in pagados),
                         "ultima_compra": f"{pagados[-1].creado:%Y-%m-%d %H:%M}"},
            ))
    resumen = [
        f"Pedidos de Pretix leídos: {len(pedidos)} · personas con un pedido pagado: {personas}",
        f"Compradores sin teléfono en Pretix (no se pueden marcar en respond.io): {sin_telefono}",
    ]
    return Resultado(destinatarios, resumen)
