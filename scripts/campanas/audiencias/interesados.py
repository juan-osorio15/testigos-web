"""Quien pidió en el sitio que le avisáramos de la venta y todavía no ha comprado.

- Contactos de la campaña en el backend con uno de los orígenes de primer
  contacto (origen: website es el formulario del sitio; referral, los
  contactos de Fernando importados el 2026-10-27), inscritos desde una fecha
  (desde).
- Fuera quien ya pagó, tiene un pedido pendiente o dejó expirar uno en Pretix
  (a ese le escribe la campaña de expirados), buscando por correo o teléfono.
- Por cada canal, solo si el backend dice que se le puede escribir.

Parámetros: campana_backend, origen (uno o una lista, por ejemplo website) y
desde (AAAA-MM-DD). Opcional, motivos: por origen, la frase del pie que dice
por qué le escribimos a la persona; la plantilla la usa como {{motivo}}.
"""

from __future__ import annotations

from audiencias import Resultado
from comun import saludo
from fuentes import backend, pretix
from lista import Destinatario


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    origenes = parametros["origen"] if isinstance(parametros["origen"], list) else [parametros["origen"]]
    motivos = parametros.get("motivos", {})
    contactos = [c for o in origenes for c in backend.leer_contactos(parametros["campana_backend"], origen=o)]
    contactos.sort(key=lambda c: c.inscrito)  # los más antiguos primero: si Resend corta en 100, salen ellos
    if not contactos:
        raise SystemExit(f"No hay contactos con origen {', '.join(origenes)} en {parametros['campana_backend']}.")
    pedidos = pretix.leer_pedidos(evento)
    con_pedido = pretix.datos_de(pedidos, pretix.COMPRO | {"expirado"})

    destinatarios = []
    antes = compraron = a_mano = sin_canal = 0
    for c in contactos:
        datos = {c.correo, c.telefono} - {""}
        if f"{c.inscrito:%Y-%m-%d}" < parametros["desde"]:
            antes += 1
        elif c.etapa in backend.ETAPAS_CON_PEDIDO or datos & con_pedido:
            compraron += 1
        elif datos & excluir:
            a_mano += 1
        elif not (c.correo_ok and c.correo) and not (c.whatsapp_ok and c.telefono):
            sin_canal += 1
        else:
            destinatarios.append(Destinatario(
                saludo=saludo(c.nombre),
                nombre=c.nombre,
                correo=c.correo if c.correo_ok else "",
                whatsapp=c.telefono.lstrip("+") if c.whatsapp_ok else "",
                detalle={"inscrito": f"{c.inscrito:%Y-%m-%d %H:%M}",
                         **({"motivo": motivos[c.origen]} if motivos else {})},
            ))

    # Comprobación de seguridad: nadie de la lista comparte correo o teléfono con un pedido.
    datos_pedido = {d.lstrip("+") for d in con_pedido}
    for d in destinatarios:
        choque = {d.correo, d.whatsapp} & datos_pedido
        assert not choque, f"Error interno: {choque} tiene pedidos y quedó en la lista"

    resumen = [
        f"Contactos con origen {', '.join(origenes)} en {parametros['campana_backend']}: {len(contactos)} · pedidos de Pretix: {len(pedidos)}",
        f"Inscritos antes del {parametros['desde']} (fuera de esta campaña): {antes}",
        f"Ya pagaron, tienen un pedido pendiente o uno expirado (no se contactan aquí): {compraron}",
        f"Dados de baja o sin autorización en los dos canales: {sin_canal}",
    ]
    if excluir:
        resumen.append(f"Excluidos a mano (--excluir): {a_mano}")
    # Al equipo le llega el motivo del primer origen, el de la mayoría.
    muestra = {"motivo": motivos[origenes[0]]} if motivos else {}
    return Resultado(destinatarios, resumen, variables_titular=muestra)

