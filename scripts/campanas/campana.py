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
    python3 scripts/campanas/campana.py respondio expirados [--salida ~/Downloads/x.csv]
    python3 scripts/campanas/campana.py registro

lista arma la lista con los datos de este momento y la guarda en
~/Documents/eventalist/datos/<evento>/<campaña>-<fecha-hora>.csv. correo y
whatsapp la vuelven a armar (alguien pudo comprar entretanto), la guardan y
muestran lo que saldría; solo envían con --enviar. Con --lista se usa una
lista ya guardada en vez de armarla. --dias N deja solo a las personas de
los últimos N días (el último intento en expirados, la inscripción en
interesados).

Sin --enviar no se envía nada. --prueba manda un solo mensaje de muestra a
esa dirección o número. Fuera del horario de la Ley 2300 no se envía, salvo
con --ignorar-horario por decisión explícita del titular.

respondio arma la lista y la guarda en el formato de importación de
respond.io, solo con quien autorizó WhatsApp, en ~/Downloads salvo que se
diga otra ruta con --salida. Las etiquetas y la boleta de interés salen de
"respondio" en la configuración; sin eso, la etiqueta es el nombre de la campaña.
A cada etiqueta se le pega la fecha del día (expirados-23102026).
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter
from datetime import datetime, timedelta
from pathlib import Path

sys.dont_write_bytecode = True  # sin __pycache__ dentro del repositorio
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "lib"))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "verificar"))

import lista as listas  # noqa: E402
import registro  # noqa: E402
import reglas  # noqa: E402
from audiencias import audiencia, excluidos  # noqa: E402
from canales import ErrorCanal, canal  # noqa: E402
from comun import BOGOTA, CONFIG, DATOS  # noqa: E402
from hechos import leer as hechos  # noqa: E402
from verificar import revisar_correo  # noqa: E402

# Columna que dice qué tan reciente es cada persona, por audiencia (--dias).
FECHA_RECIENTE = {"expirados": "ultimo_intento", "interesados": "inscrito"}

COLUMNAS_RESPONDIO = ["First Name", "Last Name", "Phone Number", "Email Address", "Tags", "Lifecycle", "Assignee",
                      "boleta_de_interes"]


def leer_config(nombre: str) -> dict:
    ruta = CONFIG / f"{nombre}.json"
    if not ruta.exists():
        existentes = ", ".join(sorted(p.stem for p in CONFIG.glob("*.json")))
        sys.exit(f"No existe la campaña {nombre}. Existen: {existentes}.")
    config = json.loads(ruta.read_text(encoding="utf-8"))
    # El evento de Pretix y la campaña del backend salen de la fuente (src/config.ts), no de cada campaña.
    integraciones = hechos()["integraciones"]
    config.setdefault("evento", integraciones["pretixEvento"])
    config.setdefault("parametros", {}).setdefault("campana_backend", integraciones["campanaBackend"])
    return config


def armar_lista(nombre: str, config: dict, args: argparse.Namespace) -> list[listas.Destinatario]:
    if args.lista:
        destinatarios = recientes(listas.cargar(Path(args.lista).expanduser()), config, args.dias)
        print(f"Lista leída de {args.lista}: {len(destinatarios)} filas")
        return destinatarios
    armar = audiencia(config["audiencia"])
    resultado = armar(config["evento"], config["parametros"], excluidos(args.excluir))
    for linea in resultado.resumen:
        print(linea)
    destinatarios = recientes(listas.con_titulares(resultado.destinatarios, resultado.variables_titular),
                              config, args.dias)
    ruta = listas.guardar(destinatarios, config["evento"], nombre)
    reales = [d for d in destinatarios if d.tipo == "real"]
    print(f"Personas en la lista: {len(reales)} -> {ruta}")
    print(f"  Con correo: {sum(1 for d in reales if d.correo)} · con WhatsApp: {sum(1 for d in reales if d.whatsapp)}")
    equipo = len(destinatarios) - len(reales)
    if equipo:
        print(f"  Más {equipo} del equipo (incluir.local.csv), que reciben cada envío real")
    return destinatarios


def recientes(destinatarios: list[listas.Destinatario], config: dict, dias: int | None) -> list[listas.Destinatario]:
    """Con --dias N, solo las personas de los últimos N días (último intento o inscripción); el equipo siempre."""
    if dias is None:
        return destinatarios
    clave = FECHA_RECIENTE[config["audiencia"]]
    desde = f"{datetime.now(BOGOTA) - timedelta(days=dias):%Y-%m-%d %H:%M}"
    quedan = [d for d in destinatarios if d.tipo != "real" or d.valores().get(clave, "") >= desde]
    print(f"Solo los últimos {dias} días ({clave} desde {desde}): "
          f"{sum(1 for d in quedan if d.tipo == 'real')} de {sum(1 for d in destinatarios if d.tipo == 'real')}")
    return quedan


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
    if nombre_canal == "correo":
        # Comprobación de vigencia (scripts/verificar/): con un dato viejo no hay vista previa ni envío.
        hallazgos = {(h.regla, h.texto) for m in mensajes for h in revisar_correo(*m.contenido, hechos())}
        if hallazgos:
            sys.exit("La plantilla tiene datos que no cuadran con la fuente:\n" + "\n".join(
                f"  {regla}: {texto}" for regla, texto in sorted(hallazgos)) + "\nCorregirla antes de seguir.")
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


def exportar_respondio(nombre: str, config: dict, args: argparse.Namespace) -> None:
    """La lista en el formato de importación de respond.io: solo personas reales con WhatsApp autorizado
    (en compradores, todo teléfono: es para marcarlos, no para escribirles). "columnas" en la
    configuración deja solo esas, para no pisar en respond.io los datos que la lista no tiene."""
    opciones = config.get("respondio", {})
    fecha = f"{datetime.now(BOGOTA):%d%m%Y}"  # expirados-23102026: cada exportación queda como su propio grupo
    etiquetas = ",".join(f"{t}-{fecha}" for t in opciones.get("tags", [nombre]))
    personas = [d for d in armar_lista(nombre, config, args) if d.tipo == "real" and d.whatsapp]
    salida = Path(args.salida).expanduser() if args.salida else (
        Path.home() / "Downloads" / f"{nombre}-respondio-{datetime.now(BOGOTA):%Y-%m-%d-%H%M}.csv")
    with open(salida, "w", encoding="utf-8", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=opciones.get("columnas", COLUMNAS_RESPONDIO), extrasaction="ignore")
        escritor.writeheader()
        for d in personas:
            # En respond.io el nombre completo va en First Name (así quedó configurado); Last Name, vacío.
            escritor.writerow({
                "First Name": " ".join(d.nombre.split()),
                "Last Name": "",
                "Phone Number": f"+{d.whatsapp}",
                "Email Address": d.correo,
                "Tags": etiquetas,
                "Lifecycle": opciones.get("lifecycle", ""),
                "Assignee": "",
                "boleta_de_interes": opciones.get("boleta_de_interes", ""),
            })
    print(f"\nPara respond.io: {len(personas)} filas con WhatsApp, etiqueta {etiquetas} -> {salida}")


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
    parser.add_argument("accion", choices=["lista", "correo", "whatsapp", "respondio", "registro"])
    parser.add_argument("campana", nargs="?", help="Nombre de la campaña (archivo en scripts/campanas/config/)")
    parser.add_argument("--lista", help="Usar esta lista ya guardada en vez de armarla de nuevo")
    parser.add_argument("--excluir", action="append", default=[],
                        help="Correo o teléfono a dejar por fuera (equipo, pruebas). Se puede repetir.")
    parser.add_argument("--dias", type=int, help="Solo las personas de los últimos N días (último intento o inscripción)")
    parser.add_argument("--salida", help="respondio: ruta del CSV (por defecto, en ~/Downloads)")
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
    elif args.accion == "respondio":
        exportar_respondio(args.campana, config, args)
    else:
        enviar(args.campana, config, args.accion, args)


if __name__ == "__main__":
    main()
