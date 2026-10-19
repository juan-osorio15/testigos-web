"""Canal WhatsApp: una plantilla aprobada por persona, con la Cloud API de Meta.

Variables de entorno, o el llavero de macOS (servicios eventalist-whatsapp y
eventalist-whatsapp-cuenta); de dónde salen: docs/campanas/README.md
    WHATSAPP_TOKEN     token del usuario del sistema "campanas"
    WHATSAPP_WABA_ID   identificador de la cuenta de WhatsApp Business
    WHATSAPP_PHONE_ID  identificador del número (opcional si la cuenta tiene uno solo)

La configuración dice qué columna de la lista llena cada variable de la
plantilla, en orden: "variables": ["codigo"] llena {{1}} con el código.
Las respuestas siguen llegando a Tevit, el chatbot; este canal solo envía.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request

from canales import ErrorCanal, Mensaje
from comun import llave
from lista import Destinatario

GRAPH = "https://graph.facebook.com/v23.0"

# Errores de Meta que significan que el problema no es del número sino del
# token, los permisos o la plantilla: no tiene sentido seguir con los demás.
ERRORES_FATALES = {0, 3, 10, 100, 190, 200, 131005, 131008, 131009, 132000, 132001, 132005,
                   132007, 132012, 132015, 132016, 133010}


class WhatsApp:
    nombre = "whatsapp"

    def __init__(self, config: dict):
        self.plantilla = config["plantilla"]
        self.idioma = config.get("idioma", "es")
        self.variables = config.get("variables", [])
        self._token = ""
        self._waba = ""
        self._numero = ""
        self._cuerpo = ""

    def dato(self, d: Destinatario) -> str:
        return d.whatsapp

    def preparar(self, destinatarios: list[Destinatario]) -> list[Mensaje]:
        cuerpo = self.cuerpo()
        usadas = sorted(set(re.findall(r"\{\{(\d+)\}\}", cuerpo)), key=int)
        if usadas != [str(i) for i in range(1, len(self.variables) + 1)]:
            raise SystemExit(f"La plantilla {self.plantilla} usa {usadas} y la configuración llena {self.variables}.")
        mensajes = []
        for d in destinatarios:
            valores = d.valores()
            faltan = [v for v in self.variables if not valores.get(v)]
            if faltan:
                raise SystemExit(f"La lista no trae {faltan} para la plantilla {self.plantilla}.")
            mensajes.append(Mensaje(d, [valores[v] for v in self.variables]))
        return mensajes

    def mostrar(self, mensajes: list[Mensaje]) -> None:
        for m in mensajes:
            texto = self.cuerpo()
            for i, valor in enumerate(m.contenido, start=1):
                texto = texto.replace(f"{{{{{i}}}}}", valor)
            print(f"\n--- {m.destinatario.whatsapp}\n{texto}")

    def enviar(self, mensaje: Mensaje, destino: str) -> str:
        cuerpo = {
            "messaging_product": "whatsapp",
            "to": destino,
            "type": "template",
            "template": {"name": self.plantilla, "language": {"code": self.idioma}},
        }
        if mensaje.contenido:
            cuerpo["template"]["components"] = [
                {"type": "body", "parameters": [{"type": "text", "text": v} for v in mensaje.contenido]}
            ]
        identificador = self._llamar(f"{self.numero()}/messages", cuerpo)["messages"][0]["id"]
        time.sleep(1)
        return identificador

    # --- Meta -----------------------------------------------------------------

    def cuerpo(self) -> str:
        """El texto aprobado de la plantilla, o se detiene explicando por qué no sirve."""
        if self._cuerpo:
            return self._cuerpo
        consulta = urllib.parse.urlencode({"name": self.plantilla, "fields": "name,status,language,components"})
        try:
            todas = self._llamar(f"{self.waba()}/message_templates?{consulta}")["data"]
        except ErrorCanal as error:
            raise SystemExit(f"Meta no dejó leer la plantilla: {error}") from None
        plantillas = [p for p in todas if p["name"] == self.plantilla]
        if not plantillas:
            raise SystemExit(f"No existe la plantilla {self.plantilla} en la cuenta de WhatsApp.")
        elegida = next((p for p in plantillas if p["language"] == self.idioma), None)
        if not elegida:
            idiomas = ", ".join(p["language"] for p in plantillas)
            raise SystemExit(f"La plantilla {self.plantilla} no está en {self.idioma}; está en: {idiomas}. Cambiar idioma en la configuración.")
        if elegida["status"] != "APPROVED":
            raise SystemExit(f"La plantilla {self.plantilla} ({self.idioma}) está en estado {elegida['status']}, no aprobada.")
        texto = next(c["text"] for c in elegida["components"] if c["type"] == "BODY")
        pie = next((c["text"] for c in elegida["components"] if c["type"] == "FOOTER"), "")
        self._cuerpo = texto + (f"\n\n{pie}" if pie else "")
        return self._cuerpo

    def waba(self) -> str:
        if not self._waba:
            self._waba = llave("WHATSAPP_WABA_ID", "eventalist-whatsapp-cuenta")
        return self._waba

    def numero(self) -> str:
        if self._numero:
            return self._numero
        self._numero = os.environ.get("WHATSAPP_PHONE_ID", "")
        if self._numero:
            return self._numero
        try:
            numeros = self._llamar(f"{self.waba()}/phone_numbers?fields=id,display_phone_number,verified_name")["data"]
        except ErrorCanal as error:
            raise SystemExit(f"Meta no dejó leer los números de la cuenta: {error}") from None
        if len(numeros) != 1:
            lista = "\n".join(f"  {n['id']}  {n['display_phone_number']}  {n['verified_name']}" for n in numeros)
            raise SystemExit(f"La cuenta tiene {len(numeros)} números; poner el de envío en WHATSAPP_PHONE_ID:\n{lista}")
        print(f"Se envía desde {numeros[0]['display_phone_number']} ({numeros[0]['verified_name']}).")
        self._numero = numeros[0]["id"]
        return self._numero

    def _llamar(self, ruta: str, cuerpo: dict | None = None) -> dict:
        if not self._token:
            self._token = llave("WHATSAPP_TOKEN", "eventalist-whatsapp")
        pedido = urllib.request.Request(
            f"{GRAPH}/{ruta}",
            data=json.dumps(cuerpo).encode() if cuerpo is not None else None,
            headers={"Authorization": f"Bearer {self._token}", "Content-Type": "application/json"},
            method="POST" if cuerpo is not None else "GET",
        )
        try:
            with urllib.request.urlopen(pedido, timeout=30) as respuesta:
                return json.load(respuesta)
        except urllib.error.HTTPError as error:
            texto = error.read().decode()
            try:
                detalle = json.loads(texto)["error"]
                codigo = detalle.get("code", 0)
                mensaje = detalle.get("error_user_msg") or detalle.get("message", texto)
            except (ValueError, KeyError):
                codigo, mensaje = 0, texto
            raise ErrorCanal(f"{error.code} · código {codigo} · {mensaje}", fatal=codigo in ERRORES_FATALES) from None
