"""Canal correo: un correo HTML por persona con Resend (dominio eventalist.co verificado).

Llave en la variable RESEND_API_KEY o en el llavero, servicio "eventalist-resend". En la plantilla y el asunto, {{columna}}
se cambia por el valor de esa columna de la lista ({{saludo}}, {{codigo}}).
Las imágenes src="cid:NOMBRE" se adjuntan incrustadas desde NOMBRE.png en la
carpeta de plantillas: sin imágenes descargadas de internet, que empujan el
correo a Promociones.
"""

from __future__ import annotations

import base64
import html as html_lib
import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

from canales import ErrorCanal, Mensaje
from comun import PLANTILLAS, llave
from lista import Destinatario

RESPONDER_A = "hola@eventalist.co"


class Correo:
    nombre = "correo"

    def __init__(self, config: dict, carpeta_previas: Path):
        self.plantilla = config["plantilla"]
        self.html = (PLANTILLAS / self.plantilla).read_text(encoding="utf-8")
        self.asunto = config["asunto"]
        self.remitente = config["remitente"]
        # List-Unsubscribe es de envíos masivos: sin ella el correo se parece más a un seguimiento.
        self.cabecera_baja = config.get("cabecera_baja", False)
        self.previas = carpeta_previas
        self.imagenes = {}
        for nombre in sorted(set(re.findall(r'src="cid:([\w-]+)"', self.html))):
            archivo = PLANTILLAS / f"{nombre}.png"
            if not archivo.exists():
                raise SystemExit(f"La plantilla usa cid:{nombre} pero no existe {archivo}")
            self.imagenes[nombre] = archivo
        self._llave = ""

    def dato(self, d: Destinatario) -> str:
        return d.correo

    def preparar(self, destinatarios: list[Destinatario]) -> list[Mensaje]:
        mensajes = []
        for d in destinatarios:
            valores = d.valores()
            asunto = html_lib.unescape(rellenar(self.asunto, valores))
            html = rellenar(self.html, valores)
            sin_llenar = set(re.findall(r"\{\{(\w+)\}\}", asunto + html))
            if sin_llenar:
                raise SystemExit(f"La plantilla o el asunto usan {sorted(sin_llenar)} y la lista no trae esas columnas.")
            mensajes.append(Mensaje(d, (asunto, html)))
        return mensajes

    def mostrar(self, mensajes: list[Mensaje]) -> None:
        self.previas.mkdir(parents=True, exist_ok=True)
        for viejo in self.previas.glob("*.html"):
            viejo.unlink()
        for numero, m in enumerate(mensajes, start=1):
            asunto, html = m.contenido
            for nombre, archivo in self.imagenes.items():
                html = html.replace(f"cid:{nombre}", archivo.resolve().as_uri())
            (self.previas / f"{numero:03d}.html").write_text(html, encoding="utf-8")
        if mensajes:
            print(f"Asunto del primero: {mensajes[0].contenido[0]}")
        print(f"Vistas previas en {self.previas}")

    def enviar(self, mensaje: Mensaje, destino: str) -> str:
        if not self._llave:
            self._llave = llave("RESEND_API_KEY", "eventalist-resend")
        asunto, html = mensaje.contenido
        cuerpo = {
            "from": self.remitente,
            "to": [destino],
            "reply_to": RESPONDER_A,
            "subject": asunto,
            "html": html,
            "text": a_texto(html),
        }
        if self.cabecera_baja:
            cuerpo["headers"] = {"List-Unsubscribe": f"<mailto:{RESPONDER_A}?subject=BAJA>"}
        if self.imagenes:
            cuerpo["attachments"] = [
                {"filename": archivo.name, "content": base64.b64encode(archivo.read_bytes()).decode(), "content_id": nombre}
                for nombre, archivo in self.imagenes.items()
            ]
        pedido = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(cuerpo).encode(),
            headers={
                "Authorization": f"Bearer {self._llave}",
                "Content-Type": "application/json",
                "User-Agent": "eventalist-campanas/1.0",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(pedido, timeout=30) as respuesta:
                identificador = json.load(respuesta)["id"]
        except urllib.error.HTTPError as error:
            # Llave, dominio o el límite diario del plan gratis (100): no tiene sentido seguir.
            raise ErrorCanal(f"Resend respondió {error.code}: {error.read().decode()[:300]}", fatal=True) from None
        time.sleep(0.6)  # Resend permite pocas solicitudes por segundo en el plan gratis
        return identificador


def rellenar(texto: str, valores: dict[str, str]) -> str:
    for clave, valor in valores.items():
        texto = texto.replace(f"{{{{{clave}}}}}", html_lib.escape(valor))
    return texto


def a_texto(html: str) -> str:
    """Versión en texto plano, para los clientes de correo que no muestran HTML."""
    sin_estilo = re.sub(r"<(style|head)[^>]*>.*?</\1>", "", html, flags=re.S | re.I)
    con_enlaces = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', r"\2 (\1)", sin_estilo, flags=re.S)
    con_saltos = re.sub(r"</(p|h1|h2|div|tr)>|<br\s*/?>", "\n", con_enlaces, flags=re.I)
    texto = re.sub(r"<[^>]+>", "", con_saltos)
    lineas = [" ".join(l.split()) for l in texto.splitlines()]
    return html_lib.unescape(re.sub(r"\n{3,}", "\n\n", "\n".join(lineas)).strip())
