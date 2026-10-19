"""Quien dejó expirar un pedido en Pretix y nunca compró.

- Une los pedidos por persona (correo o teléfono) y descarta a quien tenga
  algún pedido pagado o pendiente.
- Saludo: el nombre que dejó en el backend o el del asistente de un pedido
  de una sola boleta; si no, "Hola.".
- Correo: a todos (decisión del titular del 2026-10-12), salvo que el
  backend conozca ese correo y diga que no se le puede escribir (baja).
- WhatsApp: solo si el backend dice que la persona autorizó WhatsApp para la
  campaña y sigue vigente. Los pedidos llegan al backend con su casilla desde
  el 2026-10-09; antes, la casilla no autorizaba WhatsApp.

Parámetros: campana_backend (slug de la campaña en el backend).
"""

from __future__ import annotations

from audiencias import Resultado
from comun import saludo
from fuentes import backend, pretix
from lista import Destinatario
from personas import agrupar


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    pedidos = pretix.leer_pedidos(evento)
    contactos = backend.leer_contactos(parametros["campana_backend"])
    correo_ok = {c.correo: c.correo_ok for c in contactos if c.correo}
    nombre_backend = {d: c.nombre for c in contactos for d in (c.correo, c.telefono) if d and c.nombre}
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
        nombre = nombre_de(grupo, correos + telefonos, nombre_backend)
        destinatarios.append(Destinatario(
            saludo=saludo(nombre),
            nombre=nombre,
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


def nombre_de(grupo: list[pretix.Pedido], datos: list[str], nombre_backend: dict[str, str]) -> str:
    """El nombre que la persona dejó en el backend; si no, el del asistente de un pedido de una
    sola boleta (con varias, el primer asistente puede ser otra persona); si no, vacío ("Hola.")."""
    for dato in datos:
        if dato in nombre_backend:
            return nombre_backend[dato]
    solos = sorted((p for p in grupo if p.boletas == 1 and p.asistente), key=lambda p: p.creado)
    return solos[-1].asistente if solos else ""
