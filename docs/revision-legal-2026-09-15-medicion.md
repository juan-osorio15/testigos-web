# Dictamen: analítica (GA4), píxel de Meta y envío de datos de compra desde el backend

Cliente: Eventalist S.A.S. Fecha: 15 de septiembre de 2026. Emitido por el abogado interno (agente) a partir de `src/pages/tratamiento-de-datos.astro`, `src/pages/terminos-y-condiciones.astro`, `src/config.ts`, `docs/tratamiento-de-datos.md`, `docs/revision-legal-2026-09-04.md` y el texto de la casilla de Pretix en `docs/pretix-tienda-textos.md` (línea 65). Contexto: feature `specs/002-seo-medicion-visibilidad`.

## Veredicto en una línea

No publicar la medición con la política actual: la política y los términos vigentes afirman que los datos "no se comparten, ceden ni venden a terceros" y que los datos de la compra no se usan para publicidad, y ambas frases dejan de ser ciertas con el píxel y la Conversions API. Con la cláusula nueva, los ajustes consecuenciales y el cambio de la casilla de Pretix que van abajo, es publicable.

## Premisa jurídica común

- Las cookies e identificadores persistentes (_ga, _fbp, _fbc) que permiten reconocer un navegador en visitas sucesivas son datos personales (art. 3 lit. c Ley 1581: información vinculable a persona determinable). La SIC lo aplicó a Google en la Resolución 53593 de 2020. Con ese criterio, instalarlas exige autorización previa, expresa e informada (art. 9 Ley 1581; art. 5 Dec. 1377, todas las finalidades específicas), obtenida por un medio consultable después (art. 9 Ley 1581; art. 8 Dec. 1377, conservar prueba), y el silencio nunca vale como autorización (art. 7 Dec. 1377). Ninguna excepción del art. 10 de la Ley 1581 cubre la analítica ni la publicidad.
- Meta no es encargado: usa los datos para sus propias finalidades (audiencias, optimización). Es un tercero responsable, y el envío es una transferencia internacional. Google, para Analytics, se presenta como encargado, pero también usa la información para fines propios según su página de "sitios asociados". Tratar a ambos como receptores en Estados Unidos es lo prudente. La transferencia es lícita por dos vías acumulables: Estados Unidos figura en la Circular Externa 005 de 2017 de la SIC y el titular la autoriza de forma expresa (art. 26 lit. a Ley 1581).
- El hash SHA-256 no anonimiza para efectos de la Ley 1581: Meta y Google lo cotejan contra cuentas identificadas, luego el dato sigue siendo "determinable". El envío hasheado es un tratamiento y una transferencia; el hash es una medida de seguridad (art. 4 lit. g), no una salida del régimen.
- La Ley 2300 de 2023 no aplica a los anuncios de retargeting: su art. 5 cubre SMS, mensajería por aplicaciones, correos y llamadas, no publicidad en plataformas. Sí sigue aplicando a cualquier mensaje directo.
- Principio de responsabilidad demostrada (arts. 26 y 27 Dec. 1377): Eventalist debe poder acreditar la autorización y su alcance.

## 1. Cargar antes de la aceptación

### GA4 antes de "Aceptar"

Defendible solo a medias. La medición de audiencia sin identificador persistente es difícil de atacar; el problema es la cookie _ga y, si se activan, Google Signals y la personalización de anuncios.

Recomendación: cargar gtag de inmediato en Consent Mode con `analytics_storage` y todos los `ad_*` en `denied`, y pasar `analytics_storage` a `granted` al pulsar Aceptar. Así el sitio cuenta visitas desde el primer segundo (pings sin cookie; Google modela el resto) y solo instala _ga tras la autorización. Google Signals y la personalización de anuncios apagados en la propiedad. Se pierde únicamente la continuidad de sesión de quien nunca acepta.

Si el equipo prefiere cargar GA4 completo (con cookie) desde el inicio: riesgo de probabilidad baja y consecuencia media: orden de ajuste (art. 21 Ley 1581) y, en el peor caso, multa hasta 2.000 SMMLV, suspensión o cierre temporal (art. 23). El daño más probable es no poder entregar prueba de autorización cuando un titular la pida (art. 8 lit. b Ley 1581) y tener una política que describe algo distinto de lo que hace el sitio.

### Píxel de Meta antes de "Aceptar"

No es defendible. El píxel instala _fbp, envía URL, IP y agente a un tercero que construye perfiles para publicidad: es exactamente el supuesto que la SIC califica como dato personal y exige autorización previa. Cargarlo antes de la aceptación es tratamiento sin autorización (art. 9 Ley 1581) y transferencia a un tercero sin autorización (art. 26), y además incumple los propios términos de Meta. Probabilidad de reclamación: baja a media (el público del encuentro incluye periodistas y personas atentas al tema de memoria y conflicto). Consecuencia: media a alta (sanciones del art. 23 más el riesgo comercial con Meta y el reputacional). Agravante: un público que visita un sitio sobre el conflicto armado puede permitir inferencias de opinión política, dato sensible (art. 5 Ley 1581).

Lo que el organizador no pierde con la carga posterior: la atribución de compras y las audiencias de compradores, que se construyen por la Conversions API con el correo y el teléfono hasheados, autorizados en la casilla de Pretix, con o sin _fbp. Lo único que queda fuera son las audiencias de visitantes que no compraron y no aceptaron el aviso. Para reducir esa pérdida: aviso visible (no una franja que se pierde al hacer scroll), que permanece hasta que se acepta o se cierra, y un enlace permanente de preferencias en el pie de página.

## 2. "Aceptar" sin "Rechazar" y prueba

Basta. La ley exige un acto positivo (art. 7 Dec. 1377); no exige un botón simétrico de rechazo. Condiciones (art. 12 Ley 1581; art. 15 Dec. 1377): el aviso nombra al responsable, los tipos de cookie, los proveedores, la finalidad y enlaza la política donde están los derechos y la forma de revocar; cerrar el aviso, ignorarlo, hacer scroll o navegar no se toman como aceptación; "Más información" no acepta; la aceptación cubre lo que el aviso nombra y nada más.

Prueba que hay que guardar. Guardar fecha y versión solo en el navegador del titular es prueba en manos del titular, no del responsable. Mínimo recomendado:
1. En el navegador: identificador aleatorio de consentimiento, fecha y hora, versión del aviso, alcance (analítica, publicidad).
2. En el backend de Eventalist: un registro por aceptación con ese mismo identificador, fecha y hora, versión y alcance. Sin IP ni nombre.
3. El texto de cada versión del aviso y de la política, conservado mientras se traten datos con base en ellos (art. 16 Dec. 1377). El historial del repositorio basta si cada cambio del texto legal va en un commit propio y no se reescribe el historial.
4. Para las compras: el registro de la casilla de Pretix (fecha, pedido) y el texto vigente de la casilla en cada momento.
Si el equipo decide no registrar nada en el backend, la política debe decirlo tal cual (variante B) y aceptar que la prueba será más débil.

## 3. Textos

### (a) Aviso breve

Eventalist S.A.S. usa en este sitio cookies de analítica y de publicidad de Google y de Meta para medir las visitas y atribuir las compras de boletas. Al pulsar Aceptar se autoriza ese uso conforme a la política de tratamiento de datos, que explica cómo revocarlo. Más información · Aceptar

Notas: "Más información" enlaza a `/tratamiento-de-datos/#cookies`. La versión con razón social es la más segura (art. 15 Dec. 1377 pide nombrar al responsable).

### (b) Cláusula nueva de la política

Insertar como sección 10 en `src/pages/tratamiento-de-datos.astro` (antes de Vigencia, que pasa a ser la 11), con `id="cookies"`. Usar `{c.name}` y `{DATA_CONTACT_EMAIL}` donde aparecen la razón social y el correo.

10. Cookies, medición de audiencia y publicidad

El sitio usa cookies e identificadores similares de dos proveedores. Google Analytics 4, de Google LLC, mide la audiencia del sitio: páginas visitadas, origen de la visita, tipo de dispositivo y navegador, país aproximado y compras de boletas atribuidas a la fuente que las originó. El píxel de Meta, de Meta Platforms, Inc., mide la eficacia de los anuncios del encuentro en las plataformas de Meta, atribuye a esos anuncios las compras realizadas y permite mostrar anuncios del encuentro a quienes han visitado el sitio. Los identificadores que estos servicios guardan en el navegador, entre ellos las cookies _ga, _fbp y _fbc, no contienen el nombre ni el correo del visitante, pero permiten reconocer el navegador en visitas sucesivas, por lo que se tratan como datos personales conforme al criterio de la Superintendencia de Industria y Comercio.

Esas cookies solo se activan después de que el visitante acepta el aviso que el sitio muestra en su primera visita; hasta entonces el sitio no instala cookies de analítica ni de publicidad. La aceptación se registra con la fecha, la hora y la versión del aviso aceptado [variante A, con registro en el backend: "en los sistemas del responsable, asociada a un identificador aleatorio del navegador"; variante B, solo navegador: "en el navegador del visitante"], y el responsable conserva el texto de cada versión del aviso.

Cuando un pedido de la tienda queda pagado, el responsable transmite desde sus propios servidores a Google LLC y a Meta Platforms, Inc. el correo electrónico, el número de teléfono, el nombre y el apellido del comprador, convertidos previamente mediante la función SHA-256 en códigos que no revelan el dato y que el proveedor solo puede cotejar con cuentas que ya conoce, junto con el país, la dirección IP y el navegador desde los que se hizo la compra, los identificadores de cookie del navegador que aceptó el aviso, y el valor y la moneda del pedido. La finalidad de esa transmisión es atribuir la compra a la campaña o la fuente que la originó y medir la eficacia de la publicidad del encuentro. Esos datos no se usan para enviar mensajes al comprador por ningún canal.

Google LLC y Meta Platforms, Inc. tienen su sede en Estados Unidos y tratan la información que reciben conforme a sus propias políticas, para prestar sus servicios de medición y publicidad. La transferencia se realiza con la autorización del titular y al amparo del artículo 26 de la Ley 1581 de 2012 y de la Circular Externa 005 de 2017 de la Superintendencia de Industria y Comercio, que reconoce a Estados Unidos un nivel adecuado de protección de datos. La forma en que Google usa la información de los sitios que utilizan sus servicios se describe en https://policies.google.com/technologies/partner-sites, y las opciones sobre los anuncios de Meta están disponibles en https://www.facebook.com/adpreferences/.

El visitante puede retirar la aceptación en cualquier momento por cualquiera de estos medios: el enlace Preferencias de cookies del pie de página, que desactiva las cookies de analítica y publicidad en ese navegador; la eliminación de las cookies desde la configuración del navegador; o el correo electrónico {DATA_CONTACT_EMAIL}. La revocación surte efecto desde ese momento y respecto del navegador en que se realiza. Sobre la información que Google o Meta ya hayan recibido, el titular puede ejercer sus derechos ante esos proveedores mediante las opciones indicadas en el párrafo anterior.

### Ajustes consecuenciales en la misma política (obligatorios)

| Ubicación | Hoy | Propuesta |
|---|---|---|
| Párrafo inicial, líneas 36 a 37 | "Esos datos se guardan con esos fines y no se comparten, ceden ni venden a terceros." | "Esos datos se guardan con esos fines y no se venden ni se ceden a terceros. El sitio usa además cookies de medición y de publicidad de Google y de Meta, y transmite a esos proveedores ciertos datos de cada compra para atribuirla a su origen, según se explica en la sección 10." |
| Sección 2, tras la línea 67 | (nada) | Nuevo párrafo: "El sitio recoge además, mediante cookies e identificadores similares, los datos de navegación descritos en la sección 10, y transmite a los proveedores de medición los datos de la compra allí indicados." |
| Sección 3, lista de finalidades | termina en f) | Nuevo literal g): "Medir la audiencia del sitio y la eficacia de la publicidad del encuentro, y atribuir las compras de boletas a la fuente que las originó, en los términos de la sección 10." |
| Sección 3, líneas 102 a 103 | "Los datos de la compra no se usan para enviar publicidad ni información de otros eventos, salvo autorización separada del titular." | Mantener y añadir: "La transmisión prevista en la sección 10 no implica el envío de mensajes al comprador." |
| Sección 4, línea 110 | "El responsable no comparte, cede, transfiere ni vende los datos personales a terceros." | "El responsable no vende los datos personales ni los cede a terceros, salvo la transmisión a Google LLC y a Meta Platforms, Inc. descrita en la sección 10." |
| Sección 5, al final | (nada) | "La autorización para las cookies de analítica y de publicidad se otorga al pulsar Aceptar en el aviso del sitio. La autorización para transmitir los datos de la compra a los proveedores de medición se otorga en la casilla de la tienda, cuyo texto la menciona de forma expresa." |
| Sección 10 Vigencia | numeral 10 | Pasa a 11; actualizar `DATA_POLICY_EFFECTIVE` en `src/config.ts` a la fecha de publicación. |
| Comentario de cabecera del archivo | no menciona cookies | Añadir: "Sección 10: cookies (GA4, píxel de Meta) y envío hasheado de datos de compra a Google y Meta; dictamen del 2026-09-15." |

### Pie de página (todas las páginas)

Añadir un enlace "Cookies y preferencias" que abra el gestor de preferencias y enlace a la sección 10. Cumple el requisito de Meta de aviso en cada página con píxel y es el enlace de preferencias que la cláusula promete. Si el píxel también se instala en las páginas de pretix.eventalist.co, el aviso y el enlace deben aparecer también allí.

## 4. Casilla de Pretix y términos de compra

La aceptación en Pretix debe cubrir el envío hasheado. La casilla actual autoriza solo "emitir y enviarme la boleta, gestionar esta compra y controlar mi ingreso". La atribución publicitaria es una finalidad nueva y una transferencia a terceros: exige autorización específica (art. 5 Dec. 1377). La aceptación del aviso de cookies no la cubre.

Texto propuesto para la casilla única obligatoria de Pretix (campo Confirmation text):

He leído la [política de tratamiento de datos](https://testigosdelamemoria.com/tratamiento-de-datos/) y autorizo a Eventalist S.A.S. a tratar mis datos para emitir y enviarme la boleta, gestionar esta compra y controlar mi ingreso al evento, y a transmitir a Google y a Meta mi correo, teléfono y nombre convertidos en códigos SHA-256, junto con los datos de esta compra, para atribuirla a su origen y medir la publicidad del encuentro, según la sección 10 de la política.

Riesgo de agrupar ambas finalidades en una casilla obligatoria: defendible porque la finalidad se limita a atribuir esa misma compra y no incluye mensajes ni otros eventos. Usar los datos de compra para audiencias sobre otros eventos exigiría una casilla opcional separada y decirlo en la política.

Cambio mínimo en `src/pages/terminos-y-condiciones.astro`, sección 12:

Primer párrafo, reemplazar por: "Los datos que el comprador entrega en la tienda, es decir, el nombre del comprador y de cada asistente, el correo electrónico y, si lo indica, el teléfono, los trata {c.name} como responsable, para emitir y enviar la boleta, gestionar el pedido y el pago, emitir la factura cuando corresponda, controlar el ingreso al encuentro, atender las solicitudes sobre la compra y atribuir la compra a la campaña que la originó, conforme a la política de tratamiento de datos personales publicada en este sitio, que detalla los derechos del titular y el procedimiento para ejercerlos. Para la atribución, {c.brand} transmite a Google LLC y a Meta Platforms, Inc., en Estados Unidos, el correo, el teléfono y el nombre del comprador convertidos en códigos SHA-256, junto con los datos del pedido y del navegador, en los términos de la sección 10 de esa política. La autorización se otorga en la casilla de la tienda antes de confirmar el pedido."

Segundo párrafo, añadir al final: "La transmisión para atribuir la compra no implica el envío de mensajes al comprador."

Actualizar `TERMS_EFFECTIVE` y el comentario de cabecera del archivo.

## Lo que NO hay que cambiar

- No borrar la frase "Los datos de la compra no se usan para enviar publicidad ni información de otros eventos, salvo autorización separada del titular".
- No prometer "borrado en Google o Meta" a petición.
- No añadir un botón "Rechazar todo": no lo exige la ley colombiana; lo exigible es que nada distinto de Aceptar cuente como autorización.
- No describir en la política ajustes técnicos internos (Google Signals apagado, retención de GA4, Consent Mode).
- No enviar a Meta ni a Google los pedidos anteriores a la publicación de la nueva versión.
- No reproducir el aviso de cookies en la casilla de Pretix ni al revés.
- No poner la razón social en negrita ni repetir el correo en el aviso.

## Obligaciones operativas que la política asume

1. Que el píxel de Meta y la cookie _ga no se instalen antes de Aceptar. Verificarlo con el inspector del navegador antes de publicar.
2. Registrar cada aceptación (identificador, fecha y hora, versión, alcance) en el backend, o bien usar la variante B y no afirmar más.
3. Mantener el enlace "Cookies y preferencias" en todas las páginas, funcionando: debe revocar en ese navegador y descargar el píxel en la siguiente carga.
4. Conservar cada versión del aviso, de la política, de los términos y de la casilla de Pretix (commit propio por cambio, sin reescribir historial).
5. Atender por hola@eventalist.co las revocaciones y las consultas sobre cookies en los plazos ya asumidos (10 días hábiles consultas, 15 reclamos, arts. 14 y 15 Ley 1581), incluyendo entregar copia del registro de aceptación cuando lo pidan.
6. Enviar a la Conversions API y al Measurement Protocol solo pedidos pagados posteriores a la nueva versión y solo con los datos enumerados en la sección 10.
7. No usar los datos de compra para audiencias de otros eventos sin la casilla opcional descrita arriba.
8. Google Signals y personalización de anuncios apagados en GA4; sin ID de usuario.
9. Si el píxel se instala en pretix.eventalist.co, replicar allí el aviso y el enlace de preferencias.
10. Confirmar los enlaces de Google y de Meta antes de publicar.

## Lo que no se pudo verificar

- El boletín de la SIC de 2016 sobre cookies y la Resolución 32126 de 2022. La Resolución 53593 de 2020 contra Google sí está confirmada.
- Los términos de Meta y de Google se verificaron por reseñas y por la página de Google de sitios asociados; no se leyeron íntegros los Business Tools Terms de Meta.
- La URL exacta de preferencias de anuncios de Meta (https://www.facebook.com/adpreferences/) y su vigencia.
- Dónde ocurre el checkout de Pretix y por tanto si _fbp y _fbc estarán disponibles para la Conversions API (respuesta de la investigación técnica: el checkout corre en iframe o pestaña de pretix.eventalist.co; `_fbp` y `_fbc` se capturan en el sitio y viajan al pedido por el widget; no se instala píxel en Pretix).
- Que el backend de Eventalist pueda registrar aceptaciones del aviso.

## Fuentes

- https://sic.gov.co/slider/superindustria-ordena-google-cumplir-con-el-est%C3%A1ndar-nacional-de-protecci%C3%B3n-de-datos
- https://sedeelectronica.sic.gov.co/publicaciones/boletin-juridico/boletin/superindustria-ordena-google-llc-cumplir-con-la-ley-1581-de-2012
- https://sedeelectronica.sic.gov.co/sites/default/files/boletin-juridico/boletin/docs/Resolucion%202389%20de%2028%20de%20enero%20de%202022%20(Google%20LLC).pdf
- https://www.facebook.com/legal/technology_terms
- https://marketingplatform.google.com/about/analytics/terms/us/
- https://policies.google.com/technologies/partner-sites
- https://normas.cra.gov.co/gestor/docs/circular_superindustria_0005_2017.htm
