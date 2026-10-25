# Campañas de correo y WhatsApp

Cómo están armadas las campañas de mensajes de Eventalist y cómo se crea una nueva. Desde el 19 de octubre de 2026 todas pasan por un solo comando, `scripts/campanas/campana.py`. Lo de cada campaña (a quién, qué textos, por qué) está en su carpeta: `docs/campanas/expirados/` y `docs/campanas/interesados/`.

## Las piezas

Cada pieza hace una sola cosa y no sabe de las demás:

- **Fuentes** (`scripts/campanas/fuentes/`): leen un sistema y devuelven sus datos normalizados (correo en minúscula, teléfono en +57…). Hoy: `pretix.py` (pedidos) y `backend.py` (contactos de una campaña del backend de Eventalist, con su autorización por canal).
- **Personas** (`personas.py`): une registros de una misma persona cuando comparten correo o teléfono.
- **Audiencias** (`audiencias/`): las reglas de quién entra en una campaña y por qué canal se le puede escribir. Usan las fuentes y entregan una lista. No envían nada. Hoy: `expirados.py`, `interesados.py` y `agenda.py` (los contactos personales de alguien del equipo, solo por correo, firmados y enviados desde su dirección; los CSV de Google Contacts van en `~/Documents/eventalist/datos/<evento>/<carpeta>/` y no entran al backend; la de Fernando es `config/agenda-fernando.json`).
- **Lista** (`lista.py`): el formato único entre audiencias y canales. Columnas fijas `saludo`, `nombre`, `correo`, `whatsapp`, `tipo`; después las variables de las plantillas (como `codigo`) y el detalle para revisar a mano. Un correo o un WhatsApp vacío es un canal cerrado para esa persona.
- **Canales** (`canales/`): solo envían. `correo.py` (Resend) y `whatsapp.py` (Cloud API de Meta). Reciben la lista y la configuración del canal.
- **Reglas** (`reglas.py`): las mismas para toda campaña y canal. Horario de la Ley 2300 y no repetir un mismo mensaje. Sin límite de mensajes por persona ni por día (decisión del titular del 2026-10-19); una campaña puede ponerse límites en su configuración con `"reglas": {"maximo_por_persona": 2, "uno_por_dia": true}`.
- **Registro** (`registro.py`): un solo archivo con cada envío de todas las campañas, `~/Documents/eventalist/datos/registro-envios.csv`. Con él funcionan las reglas. Cuando el backend tenga el registro central de envíos, este archivo se importa allá.
- **Hechos del evento** (`scripts/lib/hechos.py`): el evento de Pretix, la campaña del backend, las URL y los precios no se escriben en las campañas. Salen de la fuente del sitio (`src/data/` y `src/config.ts`), que `npm run build` exporta en `dist/datos/evento.json`. Si la exportación falta o es más vieja que la fuente, el comando se detiene y pide `npm run build`.
- **Configuración** (`scripts/campanas/config/<campaña>.json`): una campaña es un archivo, no un script. Dice la audiencia y sus parámetros, y por cada canal la plantilla, el asunto, el remitente o las variables, y si está activo.

Las plantillas de correo y el logo están en `scripts/campanas/plantillas/`. Los precios van como variables (`{{precio_pase_completo}}`, `{{precio_fin_de_semana}}`, `{{precio_medio_dia}}`), que se llenan con la fuente; la redacción queda en la plantilla. Las de WhatsApp viven en Meta; el texto aprobado se guarda como referencia en el plan de cada campaña.

Nada de esto guarda datos personales en el repositorio (es público). Las listas, las vistas previas y el registro quedan en `~/Documents/eventalist/datos/`. El equipo que recibe cada envío real está en `scripts/campanas/incluir.local.csv` (columnas `nombre,correo,telefono`), que git ignora.

## Los comandos

Siempre en la carpeta `testigos-web`. Todos, listos para copiar, en `scripts/campanas/comandos.sh`:

```sh
python3 scripts/campanas/campana.py lista interesados
python3 scripts/campanas/campana.py correo interesados
python3 scripts/campanas/campana.py correo interesados --prueba tu@correo.com --enviar
python3 scripts/campanas/campana.py correo interesados --enviar
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar
python3 scripts/campanas/campana.py respondio expirados
python3 scripts/campanas/campana.py registro
```

- `lista` arma la lista con los datos de ese momento, la guarda y muestra cuántos quedaron y cuántos salieron y por qué.
- `correo` y `whatsapp` vuelven a armar la lista (alguien pudo comprar entretanto), aplican las reglas y muestran lo que saldría: vistas previas en `~/Documents/eventalist/datos/<evento>/previas-<campaña>/` para el correo, el texto en la terminal para WhatsApp. **Sin `--enviar` no se envía nada.**
- `--prueba` manda un solo mensaje de muestra, con los datos de tu fila, a ese correo o número.
- `--enviar` envía de verdad. Fuera del horario de la Ley 2300 se niega, salvo con `--ignorar-horario` por decisión explícita del titular.
- `--excluir correo-o-telefono` deja a alguien por fuera de la lista (se puede repetir).
- `--lista ARCHIVO` usa una lista ya guardada en vez de armarla.
- `--dias N` deja solo a las personas de los últimos N días: el último intento de compra en expirados, la inscripción en interesados. El equipo siempre queda.
- `respondio` arma la lista y la guarda en `~/Downloads` con el formato de importación de respond.io (First Name, Last Name, Phone Number, Email Address, Tags, Lifecycle, Assignee, boleta_de_interes), solo con quien autorizó WhatsApp. Las etiquetas, el Lifecycle y la boleta de interés se ponen en `"respondio"` dentro de la configuración de la campaña (`{"tags": ["expirados"]}`); sin eso, la etiqueta es el nombre de la campaña. A cada etiqueta se le pega la fecha del día, sin separadores (`expirados-23102026`). `--salida RUTA` lo guarda en otra parte.
- `registro` cuenta los envíos por día, campaña, canal y tipo, sin datos de personas. Con el nombre de una campaña, solo esa.

Si un envío falla por la persona (un número sin WhatsApp), queda anotado como fallido y sigue con los demás. Si falla por la llave, la plantilla o el límite diario de Resend (100 correos en el plan gratis), se detiene: se corrige y se vuelve a correr el mismo comando, que sigue con los que faltan.

## Preguntas de reunión

Cada una se responde con un comando, sin enviar nada. Leer las últimas líneas que imprime. Si el comando pide `npm run build`, correrlo primero.

- ¿Cuántos expirados no han comprado?
  `python3 scripts/campanas/campana.py lista expirados`
- ¿Cuántos expiraron en la última semana y siguen sin comprar?
  `python3 scripts/campanas/campana.py lista expirados --dias 7`
- ¿Cuántos interesados del sitio no han comprado?
  `python3 scripts/campanas/campana.py lista interesados`
- ¿Cuántos se inscribieron en la última semana?
  `python3 scripts/campanas/campana.py lista interesados --dias 7`
- ¿A cuántos les falta el correo de una campaña?
  `python3 scripts/campanas/campana.py correo expirados` (la línea "mensajes por correo listos")
- ¿Cuántos mensajes salieron y cuándo?
  `python3 scripts/campanas/campana.py registro` (por día, campaña, canal y tipo)

La lista completa, con el detalle de cada persona, queda en el CSV que indica la línea "Personas en la lista".

## Llaves (una sola vez)

- **Pretix**: token del equipo `lectura-campanas` (solo "Puede ver pedidos"), en el llavero, servicio `eventalist-pretix`. Pasos en `docs/campanas/expirados/titular/whatsapp.md`, paso 2a.
- **Backend**: token de lectura, en el llavero, servicio `eventalist-backend-lectura`.
- **Resend**: llave `campanas-correo` (pasos en `docs/campanas/expirados/titular/correo-resend.md`, paso 1). Se guarda una vez en el llavero, servicio `eventalist-resend`.
- **WhatsApp**: token del usuario del sistema `campanas` y el identificador de la cuenta (pasos en `docs/campanas/expirados/titular/whatsapp.md`, paso 1). Se guardan una vez en el llavero, servicios `eventalist-whatsapp` (el token) y `eventalist-whatsapp-cuenta` (el identificador de la cuenta).

Para guardar una llave en el llavero (la pide; pegarla y Enter):

```sh
security add-generic-password -a "$USER" -s NOMBRE-DEL-SERVICIO -w
```

## Una campaña nueva

1. Si la gente sale de una fuente que ya existe con reglas que ya existen (por ejemplo, interesados de otro evento): copiar `config/interesados.json` con otro nombre y cambiar los parámetros y las plantillas. El evento y la campaña del backend salen de la fuente; solo se ponen en la configuración (`"evento"`, `"parametros": {"campana_backend": ...}`) si la campaña es de otro evento. No hay código que escribir.
2. Si las reglas son nuevas (por ejemplo, compradores de una franja para ofrecerles el pase): un módulo en `audiencias/` con una función `armar(evento, parametros, excluir)` que devuelve un `Resultado`, y registrarlo en `audiencias/__init__.py`.
3. Si los datos salen de un sistema nuevo: un módulo en `fuentes/` que devuelva registros con `correo` y `telefono` normalizados.
4. La plantilla de correo en `scripts/campanas/plantillas/`, con la fórmula visual y un solo enlace. La de WhatsApp, a aprobación de Meta.
5. La campaña de UTM en `docs/medicion/embudo/enlaces-y-nombres.md` el mismo día.
6. Antes del envío real: `lista`, la vista previa y la prueba al titular.

## Contrato del backend

`GET https://eventalist-backend-production.up.railway.app/api/v1/marketing/campaigns/<slug>/contacts/`, en producción desde el 2026-10-19. Solo lectura.

- `Authorization: Bearer <token>` (el de lectura; el de Pretix no sirve).
- Filtros opcionales: `source` (fuente del **primer** contacto de la persona: `website`, `ticket_shop`, …) y `stage` (`interested`, `order_pending`, `order_canceled`, `purchased`).
- 200 resultados por página; se sigue `next` hasta que sea `null`.
- Cada resultado: `first_name`, `email`, `phone` (E.164 o `null`), `source`, `joined_at` (UTC), `stage`, `email_reachable`, `whatsapp_reachable`. Los dos últimos usan la misma regla que el CSV del admin filtrado por la campaña: autorización vigente para la campaña, contacto activo, dato presente y sin baja de ese canal.
- Errores: 400 filtro inválido, 401 sin token o con token equivocado, 404 campaña inexistente.

Los compradores de Pretix desde el 2026-10-09 también están en la campaña, con la autorización de WhatsApp que dieron en la tienda. Por eso la audiencia de expirados pregunta al backend a quién se le puede escribir por WhatsApp.
