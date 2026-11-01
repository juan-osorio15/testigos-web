"""Quien compró un pase en una etapa, para darle a su familia el mismo precio.

Cada persona recibe un voucher de Pretix propio con ese precio para ese
pase (docs/campanas/familia/README.md). El voucher se crea a mano en
Pretix con la lista que saca `campana.py vouchers <campaña>`.

- Entra quien tiene un pedido pagado con ese pase, hecho dentro de las
  fechas de la etapa (src/data/event.ts, salesStages), sin voucher y con
  precio mayor que cero (las cortesías y los vouchers no cuentan).
- Todas esas boletas tienen que tener el mismo precio: es el que lleva el
  voucher. Si hay más de uno, se detiene y los muestra.
- Voucher: prefijo y código del pedido más reciente que califica
  (FAMILIA-ABC12). Quien lo recibe reconoce su pedido y no hay que guardar
  una tabla de códigos.
- Correo y WhatsApp con las mismas reglas que expirados: correo a todos
  salvo baja en el backend; WhatsApp solo con autorización vigente.

Parámetros: boleta (id de src/data/event.ts), etapa (1 o 2), prefijo,
campana_backend.
"""

from __future__ import annotations

import sys
from collections import Counter

from audiencias import Resultado
from audiencias.expirados import nombre_de
from comun import saludo
from fuentes import backend, pretix
from hechos import boleta as boleta_de, leer as hechos, pesos
from lista import Destinatario
from personas import agrupar


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    boleta = boleta_de(parametros["boleta"])
    desde, hasta = fechas_de(parametros["etapa"])
    prefijo = parametros["prefijo"]
    pedidos = pretix.leer_pedidos(evento)
    contactos = backend.leer_contactos(parametros["campana_backend"])
    correo_ok = {c.correo: c.correo_ok for c in contactos if c.correo}
    nombre_backend = {d: c.nombre for c in contactos for d in (c.correo, c.telefono) if d and c.nombre}
    whatsapp_ok = {c.telefono for c in contactos if c.telefono and c.whatsapp_ok}

    def califica(p: pretix.Posicion) -> bool:
        return p.producto == boleta["productoPretix"] and not p.con_voucher and p.precio > 0

    def en_etapa(pedido: pretix.Pedido) -> bool:
        dia = f"{pedido.creado:%Y-%m-%d}"
        return pedido.estado == "pagado" and (desde is None or dia >= desde) and dia <= hasta

    precios, fuera = Counter(), Counter()
    for pedido in filter(en_etapa, pedidos):
        for p in pedido.posiciones:
            if p.producto != boleta["productoPretix"]:
                continue
            if califica(p):
                precios[p.precio] += 1
            else:
                fuera["con voucher" if p.con_voucher else "en cero"] += 1
    if not precios:
        sys.exit(f"No hay boletas pagadas de {boleta['productoPretix']} entre {desde or 'el inicio'} y {hasta}.")
    if len(precios) > 1:
        sys.exit(f"Las boletas de {boleta['productoPretix']} de la etapa {parametros['etapa']} tienen varios precios: "
                 + ", ".join(f"{pesos(v)} ({n})" for v, n in sorted(precios.items()))
                 + ". Preguntar al titular cuál lleva el voucher antes de seguir.")
    precio = next(iter(precios))

    destinatarios = []
    a_mano = sin_canal = 0
    for grupo in agrupar(pedidos):
        suyos = sorted((p for p in grupo if en_etapa(p) and any(map(califica, p.posiciones))), key=lambda p: p.creado)
        if not suyos:
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
        voucher = f"{prefijo}-{suyos[-1].codigo}"
        destinatarios.append(Destinatario(
            saludo=saludo(nombre), nombre=nombre, correo=correo, whatsapp=telefono.lstrip("+"),
            variables={"voucher": voucher, "enlace_voucher": enlace(evento, voucher)},
            detalle={"pedidos": " ".join(p.codigo for p in suyos), "compra": f"{suyos[-1].creado:%Y-%m-%d %H:%M}",
                     "boletas_del_pase": str(sum(1 for p in suyos for x in p.posiciones if califica(x)))},
        ))
    destinatarios.sort(key=lambda d: d.detalle["compra"])

    resumen = [
        f"Pedidos de Pretix leídos: {len(pedidos)} · contactos del backend en la campaña: {len(contactos)}",
        f"{boleta['productoPretix']} pagados entre {desde or 'el inicio'} y {hasta}: {sum(precios.values())} boletas "
        f"a {pesos(precio)} (el precio del voucher en Pretix)",
        f"Sin ningún canal abierto (baja de correo y sin WhatsApp autorizado): {sin_canal}",
    ]
    if fuera:
        resumen.insert(2, "No cuentan: " + ", ".join(f"{n} {motivo}" for motivo, n in sorted(fuera.items())))
    if excluir:
        resumen.append(f"Excluidos a mano (--excluir): {a_mano}")
    prueba = f"{prefijo}-PRUEBA"
    return Resultado(destinatarios, resumen,
                     variables_titular={"voucher": prueba, "enlace_voucher": enlace(evento, prueba)})


def fechas_de(etapa: int) -> tuple[str | None, str]:
    """Primer y último día de la etapa (inclusivos), de la exportación de hechos."""
    etapas = hechos()["etapas"]
    if etapa == 1:
        return None, etapas["stage1End"]
    if etapa == 2:
        return etapas["stage2Start"], etapas["stage2End"]
    sys.exit(f"Etapa desconocida: {etapa}. Esta audiencia solo sabe de la 1 y la 2.")


def enlace(evento: str, voucher: str) -> str:
    """El enlace de la tienda que deja el voucher puesto."""
    return f"{pretix.servidor()}/{hechos()['integraciones']['pretixOrganizador']}/{evento}/redeem?voucher={voucher}"
