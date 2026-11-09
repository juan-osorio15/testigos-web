"""Quien tiene un pedido pagado con alguna de ciertas boletas.

Para los avisos de servicio a quien ya compró (por ejemplo, la apertura de
puertas de un día): solo les llega a quienes esa boleta les da entrada.

- Une los pedidos por persona (correo o teléfono). Un pedido pendiente no
  cuenta: todavía no pagó.
- Correo a todos salvo baja en el backend; WhatsApp solo con autorización
  vigente, las mismas reglas que expirados.

Parámetros: productos (nombres literales en Pretix), campana_backend.
"""

from __future__ import annotations

from audiencias import Resultado
from audiencias.expirados import nombre_de
from comun import saludo
from fuentes import backend, pretix
from lista import Destinatario
from personas import agrupar


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    productos = set(parametros["productos"])
    pedidos = pretix.leer_pedidos(evento)
    contactos = backend.leer_contactos(parametros["campana_backend"])
    correo_ok = {c.correo: c.correo_ok for c in contactos if c.correo}
    nombre_backend = {d: c.nombre for c in contactos for d in (c.correo, c.telefono) if d and c.nombre}
    whatsapp_ok = {c.telefono for c in contactos if c.telefono and c.whatsapp_ok}

    def califica(pedido: pretix.Pedido) -> bool:
        return pedido.estado == "pagado" and any(p.producto in productos for p in pedido.posiciones)

    destinatarios = []
    fuera = a_mano = sin_canal = 0
    for grupo in agrupar(pedidos):
        suyos = [p for p in grupo if califica(p)]
        if not suyos:
            fuera += any(p.estado == "pagado" for p in grupo)
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
        nombre = nombre_de(grupo, correos + telefonos, nombre_backend)
        destinatarios.append(Destinatario(
            saludo=saludo(nombre), nombre=nombre, correo=correo, whatsapp=telefono.lstrip("+"),
            detalle={"pedidos": " ".join(p.codigo for p in suyos)},
        ))

    resumen = [
        f"Pedidos de Pretix leídos: {len(pedidos)} · boletas que cuentan: {', '.join(sorted(productos))}",
        f"Compraron solo otras boletas (no se contactan aquí): {fuera}",
        f"Sin ningún canal abierto (baja de correo y sin WhatsApp autorizado): {sin_canal}",
    ]
    if excluir:
        resumen.append(f"Excluidos a mano (--excluir): {a_mano}")
    return Resultado(destinatarios, resumen)
