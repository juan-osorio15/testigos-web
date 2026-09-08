# Textos de la tienda de Pretix · Testigos de la Memoria

Borrador del 7 de septiembre de 2026 para pegar en *Settings → General → Texts*
y en *Products*. Todos los campos aceptan Markdown.

Dónde aparece cada campo (según las plantillas de la tienda de Pretix):

| Campo | Dónde se ve | Cuándo |
|---|---|---|
| Frontpage text | Portada de la tienda, debajo del nombre del evento y encima de la lista de boletas. El widget embebido en el sitio NO lo muestra salvo que se active `display-event-info`. | Siempre |
| End of presale text | Portada, en lugar de la lista de boletas. Ojo: "presale" en Pretix es todo el periodo de venta en línea, no una preventa con descuento. | Cuando la venta ya cerró |
| Voucher explanation | Al lado de la casilla "Canjear un cupón" en la portada | Siempre que la casilla de cupones esté activa |
| Confirmation text | Casilla obligatoria en el último paso del checkout, antes del botón de confirmar | En cada compra |
| Additional success message | Página del pedido, justo después de "Tu pedido se ha realizado con éxito" | Al terminar la compra |
| Help text of the email field | Debajo del campo de correo en el checkout | En cada compra |
| Help text of the phone field | Debajo del campo de teléfono en el checkout | Solo si se pide teléfono |
| Banner text (top / bottom) | Encima o debajo de TODAS las páginas de la tienda | Siempre |
| Info text | En ningún sitio por defecto. Se puede insertar en la plantilla del PDF de la boleta. | Según plantilla |
| Descripción de producto | En la lista de boletas, debajo del nombre, siempre visible (no plegada) | Siempre |
| Descripción de categoría | Debajo del nombre de la categoría, encima de sus productos | Siempre |

Regla para no repetir: cada dato vive en un solo lugar. Qué es el evento → portada.
Qué incluye cada boleta → producto. Los talleres gratis → categoría. Logística de
llegada → mensaje de éxito y boleta.

---

## Frontpage text

```markdown
Los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan y analizan, en persona, los hechos que vivieron de frente.

**Hospedería Duruelo, Villa de Leyva · del viernes 6 al domingo 8 de noviembre de 2026.**

Puedes comprar el **Pase completo**, que cubre los tres días, o una **franja** suelta: cada franja es una mañana o una tarde con sus conversatorios. Toda la programación está en [testigosdelamemoria.com](https://testigosdelamemoria.com/#agenda).
```

## End of presale text

```markdown
La venta en línea ha cerrado.

Si quedan cupos, podrás comprar tu boleta en la entrada de la Hospedería Duruelo antes de cada franja. Para confirmarlo, escríbenos a hola@eventalist.co.
```

> Confirmar con el organizador que sí habrá venta en la puerta y que ese es
> el correo de contacto. Si no, dejar solo la primera línea.

## Voucher explanation

Si no se van a repartir cupones (cortesías, prensa, patrocinadores), lo mejor es
desactivar la casilla en *Settings → General → Shop display* y dejar este campo vacío.
Si sí se usan:

```markdown
Solo para invitados, prensa y aliados. Si recibiste un código, escríbelo aquí antes de elegir tu boleta.
```

## Confirmation text

Una sola casilla. Enlaza la política publicada en el sitio; no hace falta un
texto legal largo dentro de la tienda.

```markdown
He leído la [política de tratamiento de datos](https://testigosdelamemoria.com/tratamiento-de-datos/) y autorizo a Eventalist S.A.S. a tratar mis datos para emitir y enviarme la boleta, gestionar esta compra y controlar mi ingreso al evento.
```

> Revisión legal del 7 de septiembre de 2026: la casilla sí hace falta (la Ley
> 1581 no exime por ejecución de contrato) y esta redacción es suficiente. Pero
> la política publicada hoy solo se declara aplicable al formulario de
> inscripción y no lista la compra ni el ingreso entre sus finalidades. Antes
> de abrir la tienda hay que ampliarla (alcance, datos, finalidad nueva y
> mención de la tienda en la sección de autorización) y actualizar la fecha de
> vigencia. No añadir en la tienda una segunda casilla de novedades comerciales
> salvo que se quiera de verdad; en ese caso va separada, opcional y desmarcada.

## Additional success message

```markdown
Tu boleta llega al correo que registraste. Guárdala en el celular o imprímela: la escaneamos en la entrada.

Los conversatorios son en la Hospedería Duruelo, carrera 3 n.º 12-88, Villa de Leyva. Llega unos minutos antes de tu franja.
```

## Help text of the email field

Reemplaza el texto por defecto (que trata de usted) por uno en el tono del sitio:

```markdown
Aquí te enviamos la confirmación y la boleta. Revisa que esté bien escrito.
```

## Help text of the phone number field

```markdown
Opcional. Solo para avisos sobre esta compra o sobre cambios en la programación del evento.
```

## Banner text (top)

Vacío. Reservado para avisos de verdad urgentes. Ejemplos listos por si hacen falta:

```markdown
Pase completo agotado. Aún hay boletas por franja.
```

```markdown
Cambio de sede: los conversatorios del sábado se trasladan a [lugar]. La boleta sigue siendo válida.
```

## Banner text (bottom)

Vacío. El aviso de los talleres gratis va en la descripción de la categoría, que
es donde la gente lo busca.

## Info text

Para la plantilla del PDF de la boleta:

```markdown
Presenta esta boleta en la entrada, en el celular o impresa. Hospedería Duruelo, carrera 3 n.º 12-88, Villa de Leyva. Válida solo para la franja indicada; el Pase completo vale para todas.
```

---

## Productos

Categoría única. Precios sin decimales; Pretix muestra la moneda.

### Categoría: Boletas

Descripción de la categoría:

```markdown
Los talleres de periodismo del jueves 5 y el viernes 6 de noviembre, en la Casa Museo Antonio Nariño, son de entrada libre y no necesitan boleta.
```

### Pase completo · 310.000 COP

```markdown
Los siete conversatorios, del viernes 6 en la tarde al domingo 8 al mediodía, con la bienvenida, el cóctel del viernes y el cierre. Cuesta menos que las cuatro franjas por separado.
```

### Franja · Viernes 6, tarde · 90.000 COP

```markdown
3:00 p.m. Bienvenida y presentación
3:30 a 6:00 p.m. Bogotazo, dictadura y Frente Nacional (1958-1974)
6:00 p.m. Cóctel de bienvenida
```

### Franja · Sábado 7, mañana · 90.000 COP

```markdown
9:00 a 10:30 a.m. Surgimiento de las guerrillas
11:00 a.m. a 12:30 p.m. Negociaciones de paz, el Caguán y La Habana
```

### Franja · Sábado 7, tarde · 90.000 COP

```markdown
3:00 a 4:30 p.m. Narcotráfico y paramilitarismo
5:00 a 6:30 p.m. Reelecciones
```

### Franja · Domingo 8, mañana · 90.000 COP

```markdown
9:00 a 10:30 a.m. Magnicidios y víctimas de la violencia
11:00 a.m. a 12:30 p.m. Mujeres periodistas y conflicto
12:30 p.m. Cierre
```

> Las descripciones de franja llevan horarios y temas, no panelistas: si
> cambia un nombre, solo se corrige el sitio. Para saltos de línea en Markdown
> hay que terminar cada línea con dos espacios o dejar una línea en blanco.

Nombres cortos para el checkout, el correo y el PDF (campo *Name*):
`Pase completo`, `Viernes tarde`, `Sábado mañana`, `Sábado tarde`, `Domingo mañana`.
Para no perder la fecha en la boleta, conviene el nombre con fecha:
`Franja · Viernes 6, tarde`, etcétera.

---

## Diseño de la tienda (Settings → General → Shop design)

Archivos generados el 7 de septiembre de 2026 en `brand/pretix/` a partir del
logo en tinta (`Logo-01.svg`, que no tiene fondo: el blanco que se ve lo pone
pretix, ver abajo).

| Campo | Valor | Por qué |
|---|---|---|
| Header image | `brand/pretix/encabezado-tienda.png` (2340×440) | Bloque terracota con el logo en tinta, como la valla del manual. Cuando el fondo de la tienda no es blanco, pretix mete el encabezado en un panel blanco; un bloque de color a ancho completo lo convierte en banner y se acaba el marco blanco. |
| Use header image in its full size | Marcado | Así el bloque ocupa todo el ancho del panel (1170 px). |
| Show event title even if a header image is present | Desmarcado | El nombre ya está en el logo. Las fechas y el lugar salen igual en la portada. |
| Social media image | `brand/pretix/imagen-social.png` (1200×630) | Terracota con el logo dentro del cuadrado central, que es lo que muestra WhatsApp. |
| Primary color | `#7d290d` (ladrillo) | Va en botones con texto blanco y en enlaces: contraste 9.6:1. La terracota `#d45b30` queda en 3.9:1 y pretix la marca como insuficiente. |
| Accent color for success | `#757522` (oliva) | Verde de la paleta; 4.9:1, pasa. |
| Accent color for errors | `#c44f4f` (el que trae pretix) | La paleta no tiene otro rojo: el ladrillo ya es el color principal y usarlo también para errores confunde. |
| Page background color | `#efe8df` (crema) | Fondo claro principal del manual. Los paneles de contenido siguen siendo blancos, como en el sitio. |
| Use round edges | Desmarcado | Ángulos rectos, como todo el sitio. |
| Font | Open Sans | Es la única que ofrece esta instancia. Archivo, la del sitio, no está disponible. |

Alternativa si no convence el banner: `brand/pretix/logo-tienda.png` (logo
suelto, fondo transparente) sin marcar "full size". Se verá dentro del panel
blanco a unos 200 px de ancho.

Formato del logo: pretix pide PNG, JPG o GIF y el widget lo redimensiona; los
PNG generados van al doble de la resolución de pantalla. Si el SVG llegó a
guardarse, conviene reemplazarlo por el PNG para que el correo y las miniaturas
no fallen.

## Boleta en PDF (Tickets → PDF output → Layout)

Formato A6 vertical (105 × 148 mm) por bloques: terracota con el logo y las
fechas, blanco con el QR a la mitad del ancho, crema con los datos y una franja
cielo con pedido y precio.

Por qué vertical y pequeña: en el celular, el visor de PDF ajusta la página al
ancho de la pantalla. Con una hoja A4 y la boleta apaisada, un QR de 38 mm
queda en unos 70 píxeles y toca hacer zoom. En A6 vertical el QR de 52 mm
ocupa la mitad de la pantalla (unos 190 píxeles en un celular normal), por
encima de los 150 píxeles que se recomiendan para escanear desde pantalla y
lejos de la regla de "tamaño = distancia de lectura / 10". Impresa en A4
sale centrada a tamaño real, con el QR de 52 mm, más que suficiente en papel.

Archivos en `brand/pretix/`:

| Archivo | Para qué |
|---|---|
| `boleta-fondo.pdf` | Botón "Upload PDF as background". Fija el tamaño de página y lleva bloques, logo, fechas, rótulos y la nota del QR, con la fuente Archivo embebida. |
| `boleta-layout.json` | Botón `</>` del editor: reemplazar todo el código por este. Coloca los datos variables (QR, código secreto, producto, asistente, lugar, pedido y precio) en Open Sans y tinta. |
| `boleta/build.mjs` y `boleta/make.sh` | Fuente del diseño, por si cambia algo fijo (fechas, textos). `sh brand/pretix/boleta/make.sh` regenera PDF, JSON y vista previa; necesita Google Chrome. No hace falta tocarlos para configurar pretix. |

Pasos en pretix: subir el PDF de fondo, abrir `</>`, pegar el JSON, guardar y
revisar con "Preview". Los datos de muestra del editor ("John Doe", "Sample
product") los pone pretix según el idioma de la interfaz; con la interfaz en
español salen "Juan Pérez" y "Producto de muestra". El JSON no los controla.

Decisiones:

- No se imprime la fecha del evento como dato variable, porque para pretix
  todas las boletas comparten la fecha de inicio (6 de noviembre a las 3:00 p.m.)
  y en una franja del sábado sería engañosa. La fecha va en el nombre del
  producto, por eso conviene `Franja · Sábado 7, mañana` y no `Sábado mañana`.
- "6 al 8 de noviembre de 2026" y "Villa de Leyva" van fijos en el fondo.
- El QR va en negro sobre blanco y con margen: la lectura en la puerta manda.
- Los textos variables tienen autoajuste: un nombre largo se encoge en vez de
  salirse de su bloque.

---

## Correos (Settings → E-mail)

La firma va al pie de TODOS los correos de la tienda (pedido, pago, boletas,
recordatorios). Pretix la pega como texto plano, sin Markdown, y le antepone
el separador "-- " por su cuenta. Corta y sin repetir lo que el cuerpo ya dice.

### Signature

```
Testigos de la Memoria
Periodistas en la Historia
Villa de Leyva, 5 al 8 de noviembre de 2026
testigosdelamemoria.com

Organizan Fernando Cordovez y Darío Restrepo.
Boletería a cargo de Eventalist. Dudas sobre tu compra: hola@eventalist.co
```

> Confirmar que hola@eventalist.co es el canal de boletería (es el correo de
> datos personales que ya usa el sitio). Si hay WhatsApp de atención, va en esa
> misma línea: "hola@eventalist.co o WhatsApp +57 ...". Sin teléfono personal.

### Campos vecinos en la misma página

| Campo | Valor |
|---|---|
| Sender name | `Testigos de la Memoria` |
| Sender address | el correo que se verifique en pretix; ideal `boletas@testigosdelamemoria.com` o el de Eventalist |
| Subject prefix | `Testigos de la Memoria` (pretix lo muestra entre corchetes al inicio del asunto) |

La firma ya lleva la web y las fechas, así que los textos de cada correo
(confirmación, pago, boletas) no deben repetirlos.

### Contenido de los correos automáticos (Settings → E-mail → E-mail content)

Solo se personalizan los dos que marcan la experiencia: **Paid order** (llega
cuando entra el pago) y **Free order** (pedido sin cobro: cupos de cortesía o
productos gratuitos). Los demás (Placed order, Resend link, Payment reminder,
Order canceled, etc.) son informativos y los textos por defecto de pretix
cumplen.

Requisito para que el texto sea cierto: en la misma página, **Attach ticket
files** activado (y, opcionalmente, **Attach calendar files**). Sin eso la
boleta no viaja adjunta. El asunto NO repite "Testigos de la Memoria" porque el
Subject prefix ya lo antepone entre corchetes. `{name_for_salutation}` cae al
nombre de pila si existe y, si no, a un saludo neutro. `{url_button}` se
pinta como botón en HTML y, en texto plano, como "Ver detalles del pedido:
<enlace>", así que la frase anterior no debe decir "detalles del pedido" ni
terminar en dos puntos.

#### Paid order · Subject

```
Todo listo: tu lugar en Villa de Leyva está asegurado · Pedido {code}
```

#### Paid order · Text

```
Hola {name_for_salutation},

Ya está. Tienes tu lugar en Testigos de la Memoria.

Tu boleta va adjunta a este correo en PDF. Si prefieres verla o descargarla desde la página, usa el enlace de abajo.

{url_button}

Guárdala en el celular: en la entrada de la Hospedería Duruelo escaneamos el código de cada boleta.

Lo que viene: cuatro días en Villa de Leyva escuchando, de frente, a quienes vieron la historia reciente de Colombia. Los conversatorios empiezan el viernes 6 a las 3:00 p. m. Las charlas abiertas del jueves 5 y del viernes en la mañana, en la Casa Museo Antonio Nariño, no necesitan boleta.

Nos vemos en Villa de Leyva.
```

#### Free order · Subject

```
Todo listo: tienes tu lugar en Testigos de la Memoria · Pedido {code}
```

#### Free order · Text

```
Hola {name_for_salutation},

Ya está. Tienes tu lugar en Testigos de la Memoria y no hay nada que pagar.

Tu boleta va adjunta a este correo en PDF. Si prefieres verla o descargarla desde la página, usa el enlace de abajo.

{url_button}

Guárdala en el celular: en la entrada escaneamos el código de cada boleta.

Lo que viene: cuatro días en Villa de Leyva escuchando, de frente, a quienes vieron la historia reciente de Colombia. Los conversatorios empiezan el viernes 6 a las 3:00 p. m. Las charlas abiertas del jueves 5 y del viernes en la mañana, en la Casa Museo Antonio Nariño, no necesitan boleta.

Nos vemos en Villa de Leyva.
```

> Ninguno de los dos menciona hola@eventalist.co ni las fechas completas: ya
> van en la firma que pretix pega al pie. Si más adelante se cambia la firma,
> revisar que la línea de contacto siga en alguna parte.

---

## Facturas (Settings → Invoicing)

**Generate invoices: "Do not generate invoices".** La factura de pretix es un
PDF propio, sin validación de la DIAN ni CUFE, así que en Colombia no es
factura. Emitir un documento que se llama "Factura" y no lo es confunde al
comprador empresarial y expone a Eventalist. La factura electrónica o el
documento equivalente los emite Eventalist S.A.S. desde su sistema de
facturación, con el código de pedido de pretix como referencia. Wompi envía el
comprobante de pago y pretix la confirmación del pedido.

Pendiente con el contador: si cada venta se factura al comprador o basta un
documento equivalente por día, y quién es el responsable ante la DIAN
(Eventalist u organizador).

Con esa opción, las demás pestañas no aplican. En *Address form*, no pedir
dirección de facturación en el checkout: alarga la compra y recoge datos que
la política no contempla.
