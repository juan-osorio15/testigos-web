"""Une registros de una misma persona: comparten correo O teléfono.

Si alguien expiró con un correo y pagó con otro pero con el mismo celular,
es la misma persona. Sirve para cualquier registro con .correo y .telefono.
"""

from __future__ import annotations

from collections import defaultdict
from typing import Protocol, Sequence, TypeVar


class ConDatos(Protocol):
    correo: str
    telefono: str


R = TypeVar("R", bound=ConDatos)


def agrupar(registros: Sequence[R]) -> list[list[R]]:
    """Union-find por correo y por teléfono."""
    padre = list(range(len(registros)))

    def raiz(i: int) -> int:
        while padre[i] != i:
            padre[i] = padre[padre[i]]
            i = padre[i]
        return i

    primero_por_dato: dict[str, int] = {}
    for i, r in enumerate(registros):
        for dato in (f"c:{r.correo}" if r.correo else "", f"t:{r.telefono}" if r.telefono else ""):
            if not dato:
                continue
            if dato in primero_por_dato:
                padre[raiz(i)] = raiz(primero_por_dato[dato])
            else:
                primero_por_dato[dato] = i

    grupos: dict[int, list[R]] = defaultdict(list)
    for i, r in enumerate(registros):
        grupos[raiz(i)].append(r)
    return list(grupos.values())
