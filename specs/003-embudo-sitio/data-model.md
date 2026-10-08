# Modelo de datos · 003 embudo del sitio

Todo vive en el navegador. No hay datos en servidor propio.

## Campaña de la pestaña · `sessionStorage['tdm.attribution']`

JSON con estos campos, todos opcionales salvo `landing` y `capturedAt`:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`: texto, recortado a 200 caracteres.
- `gclid`, `fbclid`: texto, recortado a 200 caracteres.
- `landing`: ruta de la primera página de la campaña (o de la pestaña, si no hubo campaña), sin consulta ni fragmento. Ejemplo: `/panelistas/maria-teresa-ronderos/`.
- `capturedAt`: hora de captura en milisegundos (sirve para construir `fbc`).

Reglas (spec FR-001 a FR-003):

- La URL trae al menos un parámetro con valor → se reemplaza todo el objeto con lo de esta URL y su ruta.
- La URL no trae parámetros y ya hay objeto → no se toca.
- La URL no trae parámetros y no hay objeto → se guarda `{ landing, capturedAt }`.
- `sessionStorage` no disponible o JSON dañado → se trabaja solo con lo que trae la URL de esta página, sin guardar nada.

## Identificadores de la visita · en memoria del módulo

Solo con aceptación vigente (`isAccepted(consentVersion)`):

- `gaId`, `gaSessId`: respuesta de `gtag('get', …)`; se olvidan al revocar.
- `fbp`, `fbc`: se leen de `document.cookie` en cada sincronización. `fbc` construido si falta la cookie y hay `fbclid` (research R-04).

## Atributos del widget

Proyección de lo anterior sobre el elemento del widget. Contrato completo en [contracts/widget-tracking.md](contracts/widget-tracking.md).

## Estados

- **Sin aceptación**: UTM presentes y `landing`.
- **Con aceptación**: lo anterior más `gclid`, `ga-id`, `ga-sessid`, `fbp`, `fbc` (los que existan) y `consent=1`.
- **Revocada**: vuelve al primer estado; en el widget ya construido las claves quitadas quedan `null` (research R-05).
