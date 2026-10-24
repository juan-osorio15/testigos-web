"""Los contactos personales de alguien del equipo (por ejemplo, la agenda de Fernando), solo por correo.

El correo sale a nombre de esa persona y desde su dirección: es su invitación a
sus conocidos, con nuestra infraestructura. Por eso:

- Solo correo. Nunca WhatsApp desde el número del encuentro.
- No entran al backend ni a la campaña de marketing: la lista se lee de los
  CSV en ~/Documents/eventalist/datos/<evento>/<carpeta>/ y se borra con esa
  carpeta al terminar el evento.
- Fuera quien ya compró o tiene un pedido pendiente, y quien se dio de baja
  del correo en el backend.

Parámetros: carpeta (dentro de datos/<evento>/) y campana_backend (para las bajas).
"""

from __future__ import annotations

from audiencias import Resultado
from comun import DATOS, saludo
from fuentes import backend, contactos_csv, pretix
from lista import Destinatario


def armar(evento: str, parametros: dict, excluir: set[str]) -> Resultado:
    carpeta = DATOS / evento / parametros["carpeta"]
    contactos = contactos_csv.leer_contactos(carpeta)
    compraron = pretix.datos_de(pretix.leer_pedidos(evento), pretix.COMPRO)
    bajas = {c.correo for c in backend.leer_contactos(parametros["campana_backend"]) if c.correo and not c.correo_ok}

    vistos: dict[str, str] = {}
    for c in contactos:
        if not vistos.get(c.correo):
            vistos[c.correo] = c.nombre
    destinatarios = []
    ya_compraron = de_baja = a_mano = 0
    for correo, nombre in vistos.items():
        if correo in compraron:
            ya_compraron += 1
        elif correo in bajas:
            de_baja += 1
        elif correo in excluir:
            a_mano += 1
        else:
            destinatarios.append(Destinatario(saludo=saludo(nombre), nombre=nombre, correo=correo, whatsapp=""))

    resumen = [
        f"Correos en {carpeta}: {len(contactos)} ({len(vistos)} distintos)",
        f"Ya compraron o tienen un pedido pendiente: {ya_compraron}",
        f"Se dieron de baja del correo: {de_baja}",
    ]
    if excluir:
        resumen.append(f"Excluidos a mano (--excluir): {a_mano}")
    return Resultado(destinatarios, resumen)
