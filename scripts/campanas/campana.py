#!/usr/bin/env python3
"""Campañas de correo y WhatsApp de Eventalist: un solo comando para todas.

Cada campaña es un archivo en config/<campaña>.json: el evento, la audiencia
(quién entra, audiencias/), sus parámetros y la configuración de cada canal
(canales/). Las reglas legales (reglas.py) y el registro de envíos
(registro.py) son los mismos para todas.

Uso:
    python3 scripts/campanas/campana.py lista interesados
    python3 scripts/campanas/campana.py correo interesados [--prueba tu@correo.com] [--enviar]
    python3 scripts/campanas/campana.py whatsapp interesados [--prueba 57300...] [--enviar]
    python3 scripts/campanas/campana.py registro

lista arma la lista con los datos de este momento y la guarda en
~/Documents/eventalist/datos/<evento>/<campaña>-<fecha-hora>.csv. correo y
whatsapp la vuelven a armar (alguien pudo comprar entretanto), la guardan y
muestran lo que saldría; solo envían con --enviar. Con --lista se usa una
lista ya guardada en vez de armarla.

Sin --enviar no se envía nada. --prueba manda un solo mensaje de muestra a
esa dirección o número. Fuera del horario de la Ley 2300 no se envía, salvo
con --ignorar-horario por decisión explícita del titular.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

sys.dont_write_bytecode = True  # sin __pycache__ dentro del repositorio
sys.path.insert(0, str(Path(__file__).resolve().parent))

import lista as listas  # noqa: E402
import registro  # noqa: E402
import reglas  # noqa: E402
from audiencias import audiencia, excluidos  # noqa: E402
from canales import ErrorCanal, canal  # noqa: E402
from comun import BOGOTA, CONFIG, DATOS  # noqa: E402


def leer_config(nombre: str) -> dict:
    ruta = CONFIG / f"{nombre}.json"
    if not ruta.exists():
        existentes = ", ".join(sorted(p.stem for p in CONFIG.glob("*.json")))
        sys.exit(f"No existe la campaña {nombre}. Existen: {existentes}.")
    return json.loads(ruta.read_text(encoding="utf-8"))


def armar_lista(nombre: str, config: dict, args: argparse.Namespace) -> list[listas.Destinatario]:
    if args.lista:
        destinatarios = listas.cargar(Path(args.lista).expanduser())
        print(f"Lista leída de {args.lista}: {len(destinatarios)} filas")
        return destinatarios
    armar = audiencia(config["audiencia"])
    resultado = armar(config["evento"], config["parametros"], excluidos(args.excluir))
    destinatarios = listas.con_titulares(resultado.destinatarios, resultado.variables_titular)
    ruta = listas.guardar(destinatarios, config["evento"], nombre)
    reales = [d for d in destinatarios if d.tipo == "real"]
    for linea in resultado.resumen:
        print(linea)
    print(f"Personas en la lista: {len(reales)} -> {ruta}")
    print(f"  Con correo: {sum(1 for d in reales if d.correo)} · con WhatsApp: {sum(1 for d in reales if d.whatsapp)}")
    equipo = len(destinatarios) - len(reales)
    if equipo:
        print(f"  Más {equipo} del equipo (incluir.local.csv), que reciben cada envío real")
    return destinatarios


def enviar(nombre: str, config: dict, nombre_canal: str, args: argparse.Namespace) -> None:
    config_canal = config["canales"].get(nombre_canal)
    if not config_canal:
        sys.exit(f"La campaña {nombre} no tiene configurado el canal {nombre_canal}.")
    if not config_canal.get("activo", True):
        sys.exit(f"El canal {nombre_canal} de {nombre} está desactivado: {config_canal.get('nota', '')}")
    medio = canal(nombre_canal, config_canal, DATOS / config["evento"] / f"previas-{nombre}")

    destinatarios = [d for d in armar_lista(nombre, config, args) if medio.dato(d)]
    if args.prueba:
        # Una sola muestra, con los datos de la fila del equipo si existe.
        muestra = next((d for d in destinatarios if d.tipo == "titular"), destinatarios[0] if destinatarios else None)
        pendientes = [muestra] if muestra else []
    else:
        envios = registro.leer()
        hoy = datetime.now(BOGOTA).date().isoformat()
        pendientes, omitidos = [], Counter()
        limites = config.get("reglas", {})
        for d in destinatarios:
            motivo = reglas.motivo_para_no_enviar(
                d, nombre, nombre_canal, medio.plantilla, envios, hoy,
                maximo=limites.get("maximo_por_persona"), uno_por_dia=limites.get("uno_por_dia", False),
            )
            if motivo:
                omitidos[motivo] += 1
            else:
                pendientes.append(d)
        for motivo, cuantos in omitidos.items():
            print(f"Se omiten por {nombre_canal}, {motivo}: {cuantos}")

    mensajes = medio.preparar(pendientes)
    medio.mostrar(mensajes)
    print(f"\n{len(mensajes)} mensajes por {nombre_canal} listos ({medio.plantilla}).")
    if not args.enviar:
        print("No se envió nada (falta --enviar).")
        return

    motivo = reglas.motivo_fuera_de_horario(datetime.now(BOGOTA))
    if motivo and args.ignorar_horario:
        print(f"Aviso: {motivo}; se envía igual por --ignorar-horario.")
    elif motivo:
        sys.exit(f"No se envía: {motivo} (Ley 2300 de 2023).")

    enviados = fallidos = 0
    for m in mensajes:
        d = m.destinatario
        destino = destino_prueba(nombre_canal, args.prueba) if args.prueba else medio.dato(d)
        envio = registro.Envio(
            fecha=registro.ahora(), campana=nombre, evento=config["evento"], canal=nombre_canal,
            plantilla=medio.plantilla, correo=destino if args.prueba and nombre_canal == "correo" else d.correo,
            whatsapp=destino if args.prueba and nombre_canal == "whatsapp" else d.whatsapp,
            tipo="muestra" if args.prueba else d.tipo, estado="enviado",
        )
        try:
            envio.id_proveedor = medio.enviar(m, destino)
        except ErrorCanal as error:
            envio.estado, envio.detalle = "fallido", str(error)
            registro.anotar(envio)
            if error.fatal:
                sys.exit(f"No se pudo enviar a {destino} y se detiene todo: {error}")
            print(f"No se pudo enviar a {destino}: {error}")
            fallidos += 1
            continue
        registro.anotar(envio)
        print(f"Enviado a {destino}: {envio.id_proveedor}")
        enviados += 1
    print(f"\n{enviados} enviados, {fallidos} fallidos. Registro: {registro.RUTA}")


def destino_prueba(nombre_canal: str, valor: str) -> str:
    if nombre_canal == "whatsapp":
        numero = re.sub(r"\D", "", valor)
        if len(numero) == 10 and numero.startswith("3"):
            numero = "57" + numero
        return numero
    return valor.strip().lower()


def resumen_registro(nombre: str | None) -> None:
    """Cuántos mensajes salieron, por campaña, canal, día y tipo. Sin datos de personas."""
    conteo = Counter(
        (e.fecha[:10], e.campana, e.canal, e.tipo, e.estado)
        for e in registro.leer() if not nombre or e.campana == nombre
    )
    if not conteo:
        print("No hay envíos registrados.")
    for (dia, campana, medio, tipo, estado), cuantos in sorted(conteo.items()):
        print(f"{dia}  {campana:<14} {medio:<9} {tipo:<8} {estado:<9} {cuantos}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("accion", choices=["lista", "correo", "whatsapp", "registro"])
    parser.add_argument("campana", nargs="?", help="Nombre de la campaña (archivo en scripts/campanas/config/)")
    parser.add_argument("--lista", help="Usar esta lista ya guardada en vez de armarla de nuevo")
    parser.add_argument("--excluir", action="append", default=[],
                        help="Correo o teléfono a dejar por fuera (equipo, pruebas). Se puede repetir.")
    parser.add_argument("--prueba", help="Mandar un solo mensaje de muestra a este correo o número")
    parser.add_argument("--enviar", action="store_true", help="Enviar de verdad (sin esto solo se muestra)")
    parser.add_argument("--ignorar-horario", action="store_true",
                        help="Enviar fuera del horario de la Ley 2300 (decisión explícita del titular)")
    args = parser.parse_args()

    if args.accion == "registro":
        resumen_registro(args.campana)
        return
    if not args.campana:
        sys.exit("Falta el nombre de la campaña.")
    config = leer_config(args.campana)
    if args.accion == "lista":
        armar_lista(args.campana, config, args)
    else:
        enviar(args.campana, config, args.accion, args)


if __name__ == "__main__":
    main()
