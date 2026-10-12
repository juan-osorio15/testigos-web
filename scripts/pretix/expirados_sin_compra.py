#!/usr/bin/env python3
"""Personas con órdenes expiradas en Pretix que nunca lograron comprar.

Lee la exportación de pedidos de Pretix ("Lista de pedidos", CSV) y devuelve
una fila por persona que tuvo al menos un pedido expirado y ningún pedido
pagado ni pendiente.

Una "persona" se arma uniendo pedidos que comparten correo O teléfono: si
alguien expiró con un correo y pagó con otro pero con el mismo teléfono,
cuenta como la misma persona y no se contacta.

Uso:
    python3 scripts/pretix/expirados_sin_compra.py ORDENES.csv -o SALIDA.csv \
        [--desde 2026-10-09] [--excluir correo@x.co] [--excluir +573001234567]

--desde marca (columna "desde_fecha") a quienes tienen al menos un pedido
expirado en esa fecha o después; sirve para separar los pedidos hechos
bajo una política de datos que autoriza el recordatorio de los anteriores.

Contactos de prueba: si existe scripts/pretix/incluir.local.csv (columnas
nombre,correo,telefono; ignorado por git porque el repo es público), cada
fila se agrega al final de la salida con el código de pedido PRUEBA y
desde_fecha = si, para que esa persona reciba todos los envíos.

Solo usa la biblioteca estándar. Falla con un mensaje claro si la
exportación no tiene el formato esperado, en vez de adivinar.
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path

INCLUIR = Path(__file__).with_name("incluir.local.csv")

# Encabezados posibles por campo (exportación en español y en inglés).
# La exportación trae columnas repetidas ("Nombre", "Estado"); siempre se toma
# la primera aparición, que en ambos casos es la del pedido.
COLUMNAS = {
    "codigo": ("Código del pedido", "Order code"),
    "total": ("Total del pedido", "Order total"),
    "estado": ("Estado", "Status"),
    "correo": ("Correo electrónico", "Email"),
    "telefono": ("Número de teléfono", "Phone number"),
    "fecha": ("Fecha del pedido", "Order date"),
    "hora": ("Hora del pedido", "Order time"),
    "posiciones": ("Posiciones", "Positions"),
    "enlace": ("Enlace para realizar el pedido", "Order link"),
    "evento": ("Slug del evento", "Event slug"),
}

COMPRO = {"pagado", "paid", "pendiente", "pending"}
EXPIRO = {"expirado", "expired"}
OTROS = {"cancelado", "canceled", "cancelled"}


@dataclass
class Pedido:
    codigo: str
    estado: str
    correo: str
    telefono: str
    fecha: str
    hora: str
    total: str
    posiciones: str
    enlace: str
    evento: str


def normalizar_correo(valor: str) -> str:
    return valor.strip().lower()


def normalizar_telefono(valor: str) -> str:
    """Devuelve el número en formato E.164 (+57...) o "" si no hay número.

    Pretix antepone un apóstrofo para que Excel no lo trate como número.
    Un celular colombiano sin indicativo (10 dígitos que empiezan por 3)
    se completa con +57.
    """
    digitos = re.sub(r"\D", "", valor)
    if not digitos:
        return ""
    if len(digitos) == 10 and digitos.startswith("3"):
        digitos = "57" + digitos
    return "+" + digitos


def indices(encabezado: list[str]) -> dict[str, int]:
    resultado: dict[str, int] = {}
    faltan = []
    for campo, nombres in COLUMNAS.items():
        posicion = next(
            (encabezado.index(n) for n in nombres if n in encabezado), None
        )
        if posicion is None:
            faltan.append(f"{campo} ({' / '.join(nombres)})")
        else:
            resultado[campo] = posicion
    if faltan:
        sys.exit("La exportación no tiene estas columnas: " + "; ".join(faltan))
    return resultado


def leer_pedidos(ruta: str) -> list[Pedido]:
    with open(ruta, encoding="utf-8-sig", newline="") as archivo:
        filas = list(csv.reader(archivo))
    if not filas:
        sys.exit("El archivo está vacío.")
    pos = indices(filas[0])
    pedidos = []
    for numero, fila in enumerate(filas[1:], start=2):
        if not any(fila):
            continue
        if len(fila) != len(filas[0]):
            sys.exit(f"La fila {numero} no tiene el mismo número de columnas que el encabezado.")
        estado = fila[pos["estado"]].strip().lower()
        if estado not in COMPRO | EXPIRO | OTROS:
            sys.exit(f"Estado desconocido en la fila {numero}: {estado!r}. Revisar antes de seguir.")
        pedidos.append(
            Pedido(
                codigo=fila[pos["codigo"]].strip(),
                estado=estado,
                correo=normalizar_correo(fila[pos["correo"]]),
                telefono=normalizar_telefono(fila[pos["telefono"]]),
                fecha=fila[pos["fecha"]].strip(),
                hora=fila[pos["hora"]].strip(),
                total=fila[pos["total"]].strip(),
                posiciones=fila[pos["posiciones"]].strip(),
                enlace=fila[pos["enlace"]].strip(),
                evento=fila[pos["evento"]].strip(),
            )
        )
    return pedidos


def agrupar_personas(pedidos: list[Pedido]) -> list[list[Pedido]]:
    """Une pedidos que comparten correo o teléfono (union-find)."""
    padre = list(range(len(pedidos)))

    def raiz(i: int) -> int:
        while padre[i] != i:
            padre[i] = padre[padre[i]]
            i = padre[i]
        return i

    primero_por_dato: dict[str, int] = {}
    for i, p in enumerate(pedidos):
        for dato in (f"c:{p.correo}" if p.correo else "", f"t:{p.telefono}" if p.telefono else ""):
            if not dato:
                continue
            if dato in primero_por_dato:
                padre[raiz(i)] = raiz(primero_por_dato[dato])
            else:
                primero_por_dato[dato] = i

    grupos: dict[int, list[Pedido]] = defaultdict(list)
    for i, p in enumerate(pedidos):
        grupos[raiz(i)].append(p)
    return list(grupos.values())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("ordenes", help="CSV exportado de Pretix (Lista de pedidos)")
    parser.add_argument("-o", "--salida", required=True, help="CSV de salida con las personas a contactar")
    parser.add_argument(
        "--excluir",
        action="append",
        default=[],
        help="Correo o teléfono a dejar por fuera (equipo, pruebas). Se puede repetir.",
    )
    parser.add_argument(
        "--desde",
        help="Fecha AAAA-MM-DD: marca a quien tiene un pedido expirado desde esa fecha (columna desde_fecha).",
    )
    args = parser.parse_args()
    if args.desde and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", args.desde):
        sys.exit("--desde debe tener el formato AAAA-MM-DD.")

    pedidos = leer_pedidos(args.ordenes)
    excluidos = {normalizar_correo(x) for x in args.excluir} | {
        normalizar_telefono(x) for x in args.excluir if re.search(r"\d", x)
    }

    contactar = []
    descartados_compra = descartados_lista = solo_cancelados = 0
    for grupo in agrupar_personas(pedidos):
        estados = {p.estado for p in grupo}
        if not estados & EXPIRO:
            if estados <= OTROS:
                solo_cancelados += 1
            continue
        if estados & COMPRO:
            descartados_compra += 1
            continue
        datos = {p.correo for p in grupo} | {p.telefono for p in grupo}
        if datos & excluidos:
            descartados_lista += 1
            continue
        contactar.append(grupo)

    # Comprobación de seguridad: nadie de la salida comparte correo o teléfono
    # con un pedido pagado o pendiente.
    datos_compra = {p.correo for p in pedidos if p.estado in COMPRO and p.correo} | {
        p.telefono for p in pedidos if p.estado in COMPRO and p.telefono
    }
    for grupo in contactar:
        choque = ({p.correo for p in grupo} | {p.telefono for p in grupo}) & datos_compra
        assert not choque, f"Error interno: {choque} compró y quedó en la lista"

    filas = []
    for grupo in contactar:
        expirados = sorted((p for p in grupo if p.estado in EXPIRO), key=lambda p: (p.fecha, p.hora))
        ultimo = expirados[-1]
        correos = sorted({p.correo for p in grupo if p.correo})
        telefonos = sorted({p.telefono for p in grupo if p.telefono})
        filas.append(
            {
                "correo": correos[0] if correos else "",
                "telefono": telefonos[0] if telefonos else "",
                "whatsapp": telefonos[0].lstrip("+") if telefonos else "",
                "otros_correos": " ".join(correos[1:]),
                "otros_telefonos": " ".join(telefonos[1:]),
                **({"desde_fecha": "si" if any(p.fecha >= args.desde for p in expirados) else "no"} if args.desde else {}),
                "intentos_expirados": len(expirados),
                "tambien_cancelado": "si" if any(p.estado in OTROS for p in grupo) else "no",
                "primer_intento": f"{expirados[0].fecha} {expirados[0].hora}",
                "ultimo_intento": f"{ultimo.fecha} {ultimo.hora}",
                "boletas_ultimo_intento": ultimo.posiciones,
                "total_ultimo_intento": ultimo.total,
                "pedidos": " ".join(p.codigo for p in expirados),
                "evento": ultimo.evento,
            }
        )
    filas.sort(key=lambda f: f["ultimo_intento"], reverse=True)
    for fila in filas:
        fila["prueba"] = "no"

    pruebas = 0
    if INCLUIR.exists():
        with open(INCLUIR, encoding="utf-8-sig", newline="") as archivo:
            for contacto in csv.DictReader(archivo):
                correo = normalizar_correo(contacto["correo"])
                telefono = normalizar_telefono(contacto["telefono"])
                filas = [f for f in filas if f["correo"] != correo and f["telefono"] != telefono]
                filas.append(
                    {
                        "correo": correo,
                        "telefono": telefono,
                        "whatsapp": telefono.lstrip("+"),
                        "otros_correos": "",
                        "otros_telefonos": "",
                        **({"desde_fecha": "si"} if args.desde else {}),
                        "intentos_expirados": 0,
                        "tambien_cancelado": "no",
                        "primer_intento": "",
                        "ultimo_intento": "",
                        "boletas_ultimo_intento": "",
                        "total_ultimo_intento": "",
                        "pedidos": "PRUEBA",
                        "evento": "",
                        "prueba": "si",
                    }
                )
                pruebas += 1

    campos = list(filas[0].keys()) if filas else ["correo", "telefono", "whatsapp"]
    with open(args.salida, "w", encoding="utf-8-sig", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=campos)
        escritor.writeheader()
        escritor.writerows(filas)

    por_estado: dict[str, int] = defaultdict(int)
    for p in pedidos:
        por_estado[p.estado] += 1
    print(f"Pedidos leídos: {len(pedidos)} ({', '.join(f'{k}: {v}' for k, v in sorted(por_estado.items()))})")
    print(f"Personas con algún expirado que compraron o tienen un pedido pendiente (no se contactan): {descartados_compra}")
    if args.excluir:
        print(f"Personas excluidas a mano (--excluir): {descartados_lista}")
    print(f"Personas solo con cancelados, sin expirados (fuera de esta lista): {solo_cancelados}")
    print(f"Personas a contactar: {len(filas) - pruebas} -> {args.salida}")
    if pruebas:
        print(f"  Más {pruebas} contacto(s) de prueba de {INCLUIR.name} (columna prueba = si)")
    if args.desde:
        dentro = sum(1 for f in filas if f["desde_fecha"] == "si" and f["prueba"] == "no")
        print(f"  Con pedido expirado desde {args.desde}: {dentro} · antes: {len(filas) - pruebas - dentro}")
    sin_telefono = sum(1 for f in filas if not f["telefono"] and f["prueba"] == "no")
    if sin_telefono:
        print(f"  De ellas, sin teléfono (solo correo): {sin_telefono}")


if __name__ == "__main__":
    main()
