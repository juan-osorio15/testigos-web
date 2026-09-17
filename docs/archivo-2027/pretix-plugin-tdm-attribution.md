> **ARCHIVADO el 2026-09-17.** Esta capa (atribución de compras en el servidor) se diseñó, se
> investigó y se retiró por desproporcionada para un evento único. No está implementada en
> ningún repositorio. Se conserva por si el encuentro se repite en 2027 y la venta de boletas
> se vuelve una operación continua con pauta permanente.

# Plugin de Pretix `pretix_tdm_attribution` · entrega para el repositorio de la instancia de Pretix

Documento autocontenido para el agente que mantiene la instancia de Pretix de Eventalist (`pretix.eventalist.co`, versión 2026.5.1, self-hosted). No hace falta leer el repositorio del sitio ni el del backend. Fecha: 2026-09-17. Contrato de origen: `specs/002-seo-medicion-visibilidad/contracts/pretix-attribution.md` del repositorio del sitio testigosdelamemoria.com.

## Qué hay que construir, en una frase

Un plugin mínimo de Pretix que, cuando el comprador confirma un pedido, copie al campo `api_meta` del pedido los atributos `data-tracking-*` que el sitio puso en el widget de compra, más la IP y el user-agent del comprador. Nada más: sin modelos, sin vistas, sin ajustes.

## Por qué

El sitio testigosdelamemoria.com embebe el widget de Pretix. El checkout ocurre en un iframe de `pretix.eventalist.co`, en otro dominio, así que el Google Analytics y el píxel de Meta del sitio no ven la compra. El sitio pasa al widget los identificadores de la visita (`client_id` y `session_id` de GA4, cookies `_fbp` y `_fbc`, `gclid`, `utm_*`) como atributos `data-tracking-*` del elemento `<pretix-widget>`. Pretix conserva todos los atributos `data-*` del widget en la sesión del carrito como `widget_data` (verificado en `pretix/presale/views/cart.py` y en el JS del widget). Este plugin los traslada al pedido; el backend de Eventalist los lee por la API cuando llega el webhook de pedido pagado y envía la compra a Meta (Conversions API) y a GA4 (Measurement Protocol).

## Datos que llegan del sitio

Ejemplo de lo que el widget envía en el POST de "añadir al carrito" (`widget_data`), todo opcional:

```json
{
  "tracking-ga-id": "1234567890.1700000000",
  "tracking-ga-sessid": "1700000000",
  "tracking-fbp": "fb.1.1700000000000.1234567890",
  "tracking-fbc": "fb.1.1700000000000.AbCdEfGh",
  "tracking-gclid": "…",
  "tracking-utm-source": "instagram",
  "tracking-utm-medium": "social",
  "tracking-utm-campaign": "lanzamiento",
  "tracking-utm-content": "…",
  "tracking-utm-term": "…",
  "tracking-landing": "/",
  "tracking-event-id-checkout": "tdm.1700000000000.abc123"
}
```

Las claves `tracking-ga-id` y `tracking-ga-sessid` coinciden con las del plugin comercial "Tracking codes" de pretix.eu; si algún día se compra ese plugin, no hay que tocar el sitio.

## Resultado esperado en el pedido

`GET /api/v1/organizers/eventalist/events/testigos-memoria/orders/{code}/` debe devolver:

```json
"api_meta": {
  "tracking": {
    "ga_id": "1234567890.1700000000",
    "ga_sessid": "1700000000",
    "fbp": "fb.1.1700000000000.1234567890",
    "fbc": "fb.1.1700000000000.AbCdEfGh",
    "gclid": "…",
    "utm_source": "instagram", "utm_medium": "social", "utm_campaign": "lanzamiento",
    "landing": "/",
    "event_id_checkout": "tdm.1700000000000.abc123",
    "client_ip": "181.55.1.2",
    "client_user_agent": "Mozilla/5.0 …",
    "captured_at": "2026-09-21T15:04:05-05:00"
  }
}
```

Reglas: el prefijo `tracking-` se quita y los guiones pasan a guion bajo; los valores vacíos no se copian; cada valor se recorta a 512 caracteres; `client_ip`, `client_user_agent` y `captured_at` van siempre, aunque no haya datos del widget (compra por enlace directo a la tienda). Si el pedido ya tiene otras claves en `api_meta`, se conservan: solo se añade `tracking`.

## Implementación

Requisito: pretix ≥ 2024.7 (campo `api_meta` y señal `order_api_meta_from_request`). La instancia tiene 2026.5.1.

```
pretix-tdm-attribution/
├── pyproject.toml
└── pretix_tdm_attribution/
    ├── __init__.py
    ├── apps.py
    └── signals.py
```

`pyproject.toml`:

```toml
[build-system]
requires = ["setuptools"]
build-backend = "setuptools.build_meta"

[project]
name = "pretix-tdm-attribution"
version = "1.0.0"
description = "Copia los identificadores de la visita (widget data-tracking-*) al api_meta del pedido"
requires-python = ">=3.11"
dependencies = ["pretix>=2024.7"]

[project.entry-points."pretix.plugin"]
pretix_tdm_attribution = "pretix_tdm_attribution:PretixPluginMeta"

[tool.setuptools.packages.find]
include = ["pretix_tdm_attribution*"]
```

`__init__.py`:

```python
from django.utils.translation import gettext_lazy

try:
    from pretix.base.plugins import PluginConfig
except ImportError:
    raise RuntimeError("Este plugin se instala dentro de una instancia de pretix")

__version__ = "1.0.0"


class PluginApp(PluginConfig):
    default = True
    name = "pretix_tdm_attribution"
    verbose_name = "TDM attribution"

    class PretixPluginMeta:
        name = gettext_lazy("TDM attribution")
        author = "Eventalist"
        description = gettext_lazy("Guarda en api_meta los identificadores de la visita que trae el widget")
        visible = True
        version = __version__
        category = "INTEGRATION"
        compatibility = "pretix>=2024.7"

    def ready(self):
        from . import signals  # noqa: F401


default_app_config = "pretix_tdm_attribution.PluginApp"
```

Nota: en versiones recientes de pretix el `PretixPluginMeta` se declara como clase interna del `PluginConfig`, como arriba; el entry point apunta al paquete. Comprobar contra el plugin de ejemplo de la versión instalada (`pretix-plugin-cookiecutter` o cualquier plugin oficial) y ajustar si la estructura difiere.

`apps.py` puede quedar vacío si `__init__.py` ya define la app (o mover `PluginApp` allí y dejar en `__init__.py` solo `default_app_config`).

`signals.py`:

```python
from django.dispatch import receiver
from django.utils.timezone import now
from pretix.presale.signals import order_api_meta_from_request
from pretix.presale.views.cart import cart_session

PREFIX = "tracking-"
MAX_LEN = 512


def _client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "") or ""


@receiver(order_api_meta_from_request, dispatch_uid="tdm_attribution_api_meta")
def attach_tracking(sender, request, **kwargs):
    try:
        widget = cart_session(request).get("widget_data") or {}
    except Exception:
        widget = {}
    tracking = {
        k[len(PREFIX):].replace("-", "_"): str(v)[:MAX_LEN]
        for k, v in widget.items()
        if isinstance(k, str) and k.startswith(PREFIX) and v
    }
    tracking["client_ip"] = _client_ip(request)[:64]
    tracking["client_user_agent"] = request.META.get("HTTP_USER_AGENT", "")[:MAX_LEN]
    tracking["captured_at"] = now().isoformat()
    return {"tracking": tracking}
```

Comprobar en la versión instalada (`pretix/presale/signals.py`) la firma exacta de `order_api_meta_from_request` y cómo se fusiona lo que devuelve el receptor en `order.api_meta` (`pretix/presale/checkoutflow.py`, paso de confirmación). Si la señal no existiera en esa versión, la alternativa es `order_meta_from_request` (escribe en `meta_info`, que no se expone por API) más un `PATCH` del `api_meta` desde el backend: avisar antes de tomar ese camino.

## Instalación

1. `pip install /ruta/al/paquete` (o desde el repo) en el mismo entorno donde corre pretix.
2. Reiniciar los procesos de pretix (web y worker).
3. Panel → evento `testigos-memoria` → Configuración → Plugins → activar "TDM attribution".
4. Sin migraciones (no hay modelos).

## Prueba de aceptación

1. Poner el evento en modo test o usar un producto de prueba.
2. Desde el sitio (o desde una página local que embeba el widget con `data-tracking-utm-source="prueba"` y `data-tracking-fbc="fb.1.1.TEST123"`), añadir al carrito y completar un pedido.
3. `GET .../orders/{code}/` → `api_meta.tracking` contiene `utm_source: "prueba"`, `fbc: "fb.1.1.TEST123"`, `client_ip`, `client_user_agent`, `captured_at`.
4. Pedido hecho directamente en la tienda (sin widget): `api_meta.tracking` solo con `client_ip`, `client_user_agent`, `captured_at`.
5. El resto del checkout no cambia: mismos pasos, mismos correos.

## Otros ajustes del panel que hace Eventalist en la misma instancia (no son del plugin)

- Evento → Configuración → General: "Pedir a los buscadores que no indexen la tienda".
- Organizador → Webhooks: URL del backend con Basic Auth, acción `pretix.event.order.paid`.
- Organizador → Teams → API token de solo lectura (pedidos e ítems) para el backend.
- Evento → Configuración → General → Textos de confirmación: casilla nueva (texto en el repositorio del sitio, `docs/pretix-tienda-textos.md`), el día que se publique la política de datos nueva.

## Qué devolver al terminar

Un `.md` corto con: versión de pretix comprobada, nombre exacto del paquete y del plugin en el panel, cómo se instaló (comando), resultado de la prueba de aceptación (JSON del `api_meta` de un pedido de prueba), y cualquier diferencia respecto a este documento marcada como "CAMBIO". Se guarda en el repositorio del sitio como `docs/pretix-plugin-tdm-attribution-resultado.md`.
