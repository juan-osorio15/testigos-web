"""El formato único de lista: lo que una audiencia entrega y lo que un canal envía.

Columnas fijas: saludo, nombre, correo, whatsapp, tipo. Un dato vacío
significa que por ese canal no se le escribe (no lo tiene, no lo autorizó o
se dio de baja): la audiencia ya lo decidió. Después van las variables de
las plantillas (por ejemplo codigo) y el detalle de la audiencia, solo para
revisar a mano.

tipo es "real" o "titular" (el equipo, de incluir.local.csv: recibe cada
envío real para ver lo que llega, y no cuenta para los límites).
"""

from __future__ import annotations

import csv
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from comun import BOGOTA, DATOS, INCLUIR, normalizar_correo, normalizar_telefono, saludo

FIJAS = ["saludo", "nombre", "correo", "whatsapp", "tipo"]


@dataclass
class Destinatario:
    saludo: str
    nombre: str
    correo: str
    whatsapp: str  # E.164 sin el +, como lo pide Meta
    tipo: str = "real"
    variables: dict[str, str] = field(default_factory=dict)
    detalle: dict[str, str] = field(default_factory=dict)

    def valores(self) -> dict[str, str]:
        """Todo lo que una plantilla puede usar: {{saludo}}, {{codigo}}, …

        primer_nombre sale del saludo ("Hola, Ana." → "Ana"), con la misma limpieza; vacío si
        el saludo es "Hola.". Para plantillas de WhatsApp, que no pueden empezar con una variable."""
        primer = self.saludo.removeprefix("Hola, ").removesuffix(".") if self.saludo != "Hola." else ""
        return {**self.detalle, **self.variables, "saludo": self.saludo, "nombre": self.nombre,
                "primer_nombre": primer}


def titulares(variables: dict[str, str]) -> list[Destinatario]:
    """Filas del equipo, con variables de muestra (por ejemplo codigo = PRUEBA)."""
    if not INCLUIR.exists():
        return []
    with open(INCLUIR, encoding="utf-8-sig", newline="") as archivo:
        return [
            Destinatario(
                saludo=saludo(c.get("nombre")),
                nombre=c.get("nombre", ""),
                correo=normalizar_correo(c.get("correo")),
                whatsapp=normalizar_telefono(c.get("telefono")).lstrip("+"),
                tipo="titular",
                variables=dict(variables),
            )
            for c in csv.DictReader(archivo)
        ]


def con_titulares(reales: list[Destinatario], variables: dict[str, str]) -> list[Destinatario]:
    """Agrega al equipo al final, sin duplicar a nadie que ya esté en la lista."""
    equipo = titulares(variables)
    datos = {d.correo for d in equipo if d.correo} | {d.whatsapp for d in equipo if d.whatsapp}
    return [d for d in reales if not ({d.correo, d.whatsapp} & datos)] + equipo


def guardar(destinatarios: list[Destinatario], evento: str, campana: str, salida: Path | None = None) -> Path:
    if salida is None:
        salida = DATOS / evento / f"{campana}-{datetime.now(BOGOTA):%Y-%m-%d-%H%M}.csv"
    salida.parent.mkdir(parents=True, exist_ok=True)
    variables = sorted({k for d in destinatarios for k in d.variables})
    detalle = sorted({k for d in destinatarios for k in d.detalle})
    with open(salida, "w", encoding="utf-8-sig", newline="") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=FIJAS + variables + detalle)
        escritor.writeheader()
        for d in destinatarios:
            escritor.writerow({
                "saludo": d.saludo, "nombre": d.nombre, "correo": d.correo, "whatsapp": d.whatsapp,
                "tipo": d.tipo, **d.variables, **d.detalle,
            })
    return salida


def cargar(ruta: Path) -> list[Destinatario]:
    """Lee una lista guardada; las columnas fuera de las fijas quedan como variables."""
    with open(ruta, encoding="utf-8-sig", newline="") as archivo:
        filas = list(csv.DictReader(archivo))
    if filas and set(FIJAS) - set(filas[0]):
        raise SystemExit(f"{ruta} no tiene el formato de lista de las campañas (faltan {set(FIJAS) - set(filas[0])}).")
    return [
        Destinatario(
            saludo=f["saludo"], nombre=f["nombre"], correo=f["correo"], whatsapp=f["whatsapp"], tipo=f["tipo"],
            variables={k: v for k, v in f.items() if k not in FIJAS},
        )
        for f in filas
    ]
