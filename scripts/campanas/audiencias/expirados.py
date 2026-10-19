"""Quien dejó expirar un pedido en Pretix y nunca compró.

- Une los pedidos por persona (correo o teléfono) y descarta a quien tenga
  algún pedido pagado o pendiente.
- Correo: a todos (decisión del titular del 2026-10-12), salvo que el
  backend conozca ese correo y diga que no se le puede escribir (baja).
- WhatsApp: solo si el backend dice que la persona autorizó WhatsApp para la
  campaña y sigue vigente. Los pedidos llegan al backend con su casilla desde
  el 2026-10-09; antes, la casilla no autorizaba WhatsApp.

Parámetros: campana_backend (slug de la campaña en el backend).
"""

from __future__ import annotations

from audiencias import Resultado
from fuentes import backend, pretix
from lista import Destinatario
from personas import agrupar


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    pedidos = pretix.leer_pedidos(evento)
    contactos = backend.leer_contactos(parametros["campana_backend"])
    correo_ok = {c.correo: c.correo_ok for c in contactos if c.correo}
    whatsapp_ok = {c.telefono for c in contactos if c.telefono and c.whatsapp_ok}

    destinatarios = []
    compraron = a_mano = sin_canal = 0
    for grupo in agrupar(pedidos):
        estados = {p.estado for p in grupo}
        if "expirado" not in estados:
            continue
        if estados & pretix.COMPRO:
            compraron += 1
            continue
        correos = sorted({p.correo for p in grupo if p.correo})
        telefonos = sorted({p.telefono for p in grupo if p.telefono})
        if (set(correos) | set(telefonos)) & excluir:
            a_mano += 1
            continue
        correo = next((c for c in correos if correo_ok.get(c, True)), "")
        telefono = next((t for t in telefonos if t in whatsapp_ok), "")
        if not correo and not telefono:
            sin_canal += 1
            continue
        expirados = sorted((p for p in grupo if p.estado == "expirado"), key=lambda p: p.creado)
        ultimo = expirados[-1]
        destinatarios.append(Destinatario(
            saludo="Hola.",  # la API de pedidos no trae un nombre confiable
            nombre="",
            correo=correo,
            whatsapp=telefono.lstrip("+"),
            variables={"codigo": ultimo.codigo},
            detalle={
                "intentos_expirados": str(len(expirados)),
                "primer_intento": f"{expirados[0].creado:%Y-%m-%d %H:%M}",
                "ultimo_intento": f"{ultimo.creado:%Y-%m-%d %H:%M}",
                "boletas_ultimo_intento": str(ultimo.boletas),
                "total_ultimo_intento": ultimo.total,
                "pedidos": " ".join(p.codigo for p in expirados),
            },
        ))
    destinatarios.sort(key=lambda d: d.detalle["ultimo_intento"], reverse=True)

    # Comprobación de seguridad: nadie de la lista comparte correo o teléfono con un pedido pagado o pendiente.
    datos_compra = {d.lstrip("+") for d in pretix.datos_de(pedidos, pretix.COMPRO)}
    for d in destinatarios:
        choque = {d.correo, d.whatsapp} & datos_compra
        assert not choque, f"Error interno: {choque} compró y quedó en la lista"

    resumen = [
        f"Pedidos de Pretix leídos: {len(pedidos)} · contactos del backend en la campaña: {len(contactos)}",
        f"Expiraron y después compraron o tienen un pedido pendiente (no se contactan): {compraron}",
        f"Sin ningún canal abierto (baja de correo y sin WhatsApp autorizado): {sin_canal}",
    ]
    if excluir:
        resumen.append(f"Excluidos a mano (--excluir): {a_mano}")
    return Resultado(destinatarios, resumen, variables_titular={"codigo": "PRUEBA"})
