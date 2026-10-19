"""Audiencias: las reglas de quién entra en una campaña.

Cada audiencia lee sus fuentes y devuelve una lista en el formato único
(lista.Destinatario) con un resumen de cuántos quedaron fuera y por qué.
Decide también por qué canal se le puede escribir a cada persona: un dato
vacío es un canal cerrado. No envía nada ni sabe de plantillas.

Para una audiencia nueva: un módulo con una función
armar(evento, parametros, excluir) -> Resultado, y registrarla abajo.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Callable

from comun import normalizar_correo, normalizar_telefono
from lista import Destinatario


@dataclass
class Resultado:
    destinatarios: list[Destinatario]
    resumen: list[str] = field(default_factory=list)
    # Variables con que van las filas del equipo (por ejemplo codigo = PRUEBA).
    variables_titular: dict[str, str] = field(default_factory=dict)


def excluidos(valores: list[str]) -> set[str]:
    """Correos y teléfonos que se dejan por fuera a mano (--excluir)."""
    return {normalizar_correo(x) for x in valores} | {normalizar_telefono(x) for x in valores if re.search(r"\d", x)}


def audiencia(nombre: str) -> Callable[[str, dict, set[str]], Resultado]:
    from audiencias import expirados, interesados

    registradas = {"expirados": expirados.armar, "interesados": interesados.armar}
    if nombre not in registradas:
        raise SystemExit(f"Audiencia desconocida: {nombre}. Existen: {', '.join(registradas)}.")
    return registradas[nombre]
