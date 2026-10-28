"""Google Ads por API, como la cuenta de servicio claude-lector (acceso Estándar).

    python3 scripts/ads/ads.py buscar "SELECT campaign.name FROM campaign"
    python3 scripts/ads/ads.py cambiar <servicio> operaciones.json [--validar]

`buscar` corre una consulta GAQL e imprime el JSON. `cambiar` manda las
operaciones de un servicio (`campaigns`, `adGroups`, `adGroupCriteria`,
`conversionActions`...) a `customers/<cuenta>/<servicio>:mutate`; con
`--validar` Google las revisa sin aplicarlas.

La plata la maneja el titular: el candado de abajo rechaza presupuestos,
facturación, montos de puja y activar campañas. Si una operación lo toca,
no se manda nada.

Credenciales: las de gcloud, suplantando a claude-lector (ver
docs/medicion/embudo/estado.md, "Cómo mirar"). Sin developer token: Google
lo retiró el 9 de septiembre de 2026.
"""

from __future__ import annotations

import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

CUENTA = "9927418619"  # Testigos de la Memoria (992-741-8619)
PROYECTO = "eventalist-analytics"
CUENTA_DE_SERVICIO = "claude-lector@eventalist-analytics.iam.gserviceaccount.com"
VERSION = "v23"
API = f"https://googleads.googleapis.com/{VERSION}/customers/{CUENTA}"

SERVICIOS_DE_PLATA = {"campaignBudgets", "accountBudgetProposals", "billingSetups", "customers"}
CAMPOS_DE_PLATA = {
    "amountMicros",
    "cpcBidMicros",
    "cpmBidMicros",
    "cpvBidMicros",
    "cpcBidCeilingMicros",
    "cpcBidFloorMicros",
    "targetCpaMicros",
    "targetCpmMicros",
    "targetRoas",
    "percentCpcBidMicros",
    "campaignBudget",  # cambiar de presupuesto a una campaña existente
}


def token() -> str:
    salida = subprocess.run(
        [
            "gcloud", "auth", "print-access-token",
            f"--impersonate-service-account={CUENTA_DE_SERVICIO}",
            "--scopes=https://www.googleapis.com/auth/adwords",
        ],
        capture_output=True, text=True,
    )
    if salida.returncode != 0:
        sys.exit("gcloud no dio credenciales. Correr `gcloud auth login` y volver a intentar.")
    return salida.stdout.strip()


def llamar(ruta: str, cuerpo: dict) -> dict:
    pedido = urllib.request.Request(
        f"{API}/{ruta}",
        data=json.dumps(cuerpo).encode(),
        headers={
            "Authorization": f"Bearer {token()}",
            "x-goog-user-project": PROYECTO,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(pedido) as respuesta:
            return json.load(respuesta)
    except urllib.error.HTTPError as error:
        sys.exit(error.read().decode())


def plata_en(valor, ruta: str = "") -> list[str]:
    """Rutas de los campos de plata dentro de una operación."""
    hallados = []
    if isinstance(valor, dict):
        for clave, hijo in valor.items():
            aqui = f"{ruta}.{clave}" if ruta else clave
            if clave in CAMPOS_DE_PLATA:
                hallados.append(aqui)
            hallados += plata_en(hijo, aqui)
    elif isinstance(valor, list):
        for i, hijo in enumerate(valor):
            hallados += plata_en(hijo, f"{ruta}[{i}]")
    return hallados


def candado(servicio: str, operaciones: list[dict]) -> None:
    problemas = []
    if servicio in SERVICIOS_DE_PLATA:
        problemas.append(f"el servicio {servicio} es de plata")
    for i, operacion in enumerate(operaciones):
        for ruta in plata_en(operacion):
            if not (ruta.endswith("campaignBudget") and "create" in operacion):
                problemas.append(f"operación {i}: {ruta}")
        if servicio == "campaigns":
            campana = operacion.get("create") or operacion.get("update") or {}
            if campana.get("status") == "ENABLED":
                problemas.append(f"operación {i}: activar una campaña la hace el titular")
    if problemas:
        sys.exit("Candado de plata, no se mandó nada:\n- " + "\n- ".join(problemas))


def main() -> None:
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == "buscar":
        print(json.dumps(llamar("googleAds:search", {"query": args[1]}), ensure_ascii=False, indent=2))
    elif len(args) >= 3 and args[0] == "cambiar":
        servicio, archivo = args[1], args[2]
        operaciones = json.loads(Path(archivo).read_text(encoding="utf-8"))
        candado(servicio, operaciones)
        cuerpo = {"operations": operaciones, "validateOnly": "--validar" in args}
        print(json.dumps(llamar(f"{servicio}:mutate", cuerpo), ensure_ascii=False, indent=2))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main()
