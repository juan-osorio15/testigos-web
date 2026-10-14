# Estado de la entrega

Qué existe de verdad en cada repo y qué falta. Reglas:
- Cada repo actualiza **solo su propia sección**, con fecha. Las de los demás no se editan.
- Las preguntas van en "Preguntas abiertas", con quién debe responderlas.
- **Cuando un tema se cierra, se mueve a `estado-historial.md` y aquí queda solo una línea con la conclusión.**
- El diseño y el contrato siguen en `diseno.md`, `prompt-pretix.md` y `prompt-backend.md`.
- Todo lo anterior al 2026-10-13 está, tal cual, en `estado-historial.md`.

Documentos con los datos operativos (no se copian aquí):
- Despliegue, URL, variables, tokens y ajustes del panel: `guia-deploy-tracking.md`.
- Enlaces con UTM y regla de nombres: `enlaces-y-nombres.md`.
- Informes, GA4 y Meta para el titular: `titular/reportes-para-el-informe.md` y `pretix-wompi/docs/ga4-tablas-utm.md`.
- Scripts de diagnóstico (solo lectura): `pretix-wompi/docs/diagnostico/`.
- Qué dato queda en qué modelo del backend: historial, "Dónde queda cada dato y cómo se obtiene".

## pretix-wompi (actualizado 2026-10-13)

**En producción:**
- Plugin `pretix-eventalist-tracking` activo en `testigos-memoria` desde la noche del 2026-10-08.
  Salió en un solo push junto con pretix 2026.5.4 y el barrido de Wompi (los despliegues A y B se
  fusionaron). Commit y hora de ese push: no verificado en este archivo.
- Arreglo de GA4 (D6a): commit `982f155` en `main`, desplegado el 2026-10-13 a las 18:20 (Bogotá), sin
  migraciones. Los envíos con `ga_id` y `ga_sessid` ya no fijan `timestamp_micros`. Solo afecta a compras nuevas.
- Captura comprobada: de 27 pedidos con el plugin activo, 26 traen `landing` y 25 traen `ga_id`.

**Falta:**
- Confirmar con la compra `verificacion-ga4` (ver "Pendientes del titular") que GA4 ya pone la compra en
  la fila de su campaña. Si sale en `(not set)`, pretix-wompi replantea.
- Aviso visible cuando el slug de campaña del evento está vacío: factible, no hecho. Espera el sí del titular.
- No verificado en este archivo: ensayo en producción con `testigos-sandbox` (vencer y extender plazo,
  `expired` → `pending`) y si `reference_sweep` quedó encendido en los dos eventos.

**En curso:** nada más, aparte de esperar el resultado de `verificacion-ga4`.

## eventalist-backend (actualizado 2026-10-08)

**En producción desde el 2026-10-08 a las 22:33 (Bogotá):** merge `bf5bb74` en `master`, rama
`016-pretix-ticket-orders` (`b1b6d06`, `6761a68`).
- Endpoint `POST /api/v1/marketing/ticket-orders/`; sin token responde `401`.
- Modelos `TicketOrder` y `ContactConsent`, etapa de compra en `CampaignMembership`, filtro por etapa,
  exportaciones por campaña y resumen de ventas por UTM en el admin.
- El ensayo de la migración en una rama de Neon se saltó por decisión del titular. Antes del merge se hizo
  la copia en Neon y se configuraron `PRETIX_SERVICE_TOKEN` y `PRETIX_TESTMODE_CAMPAIGNS`.
- Spec y resultado en `specs/016-pretix-ticket-orders/` del repo del backend.

**Falta (estado al 2026-10-08; no hay actualización posterior):**
- Exportación CSV de pedidos con UTM (aprobada por el titular): hecha en la rama, iba en un segundo
  despliegue sin migraciones. Si ya se desplegó: no verificado.
- Ensayo contra producción (paso 7 de su guía) y copia de `resultado-backend.md` a este directorio: no verificado.

**En curso:** no verificado.

## testigos-web (actualizado 2026-10-13)

**En producción (GitHub Pages, push a `main`):**
- Embudo del sitio (`attribution.ts`, `720a1eb`): publicado el 2026-10-08 a las 22:36, en el despliegue de `fc8ca52`.
- `referrer` (`5e4737f`): 2026-10-12 a las 15:13.
- Guardado de la campaña por 30 días en `localStorage` (`d91b22a`): 2026-10-13 a las 09:32.
- Comprobado en el sitio real: el `widget_data` lleva la campaña con y sin cookies, y en una visita
  posterior sin UTM. `www` redirige a la raíz conservando la consulta.
- Consentimiento de GA4 en modo avanzado (`EventLayout.astro`). Si alguien cierra el aviso, navega y
  acepta después en otra página, GA4 cuenta la visita como directa. Solo afecta a GA4.

**Commits locales sin push (9, de `296a687` a `b55d1f1`):** solo documentos. Entre ellos:
- `enlaces-y-nombres.md` con la regla de nombres "sin ruido" (campaña corta o `permanente`, contenido
  `{pieza}_{variable}`, sin `utm_term`);
- enlaces del chatbot con UTM en `docs/system-prompt-atencion.md` y `docs/chatbot-conocimiento.md`;
- guía de reportes, estándar de medición, guía de despliegue y textos de la tienda.
Ninguno cambia el sitio publicado. El push espera el visto bueno del titular; al hacerlo, se anotan aquí
el commit y la hora.

**Sin commit:** este `estado.md` y `estado-historial.md` (compactación del 2026-10-13, que incluye el
reporte de Meta que agregó pretix-wompi).

**Falta:**
- Responder la pregunta del reporte de Meta frente a GA4 (ver "Preguntas abiertas").
- No verificado en este archivo: si los textos legales con el día D (vigencias y versión `tienda-<D>`)
  quedaron publicados junto con el embudo.

**En curso:** nada.

## Conclusiones cerradas

Cada línea remite a la sección de `estado-historial.md` con el detalle.
- **Ventas sin campaña del 12 de octubre:** el sitio, el widget y el plugin funcionan. Las compras llegaron
  por visitas sin UTM (directas, Google), por cambio de navegador (`Z9UMQ` → `7H7LT`) o por enlaces de
  Instagram y anuncios sin parámetros de URL. Ningún pedido anterior de un comprador traía UTM. ("Preguntas
  de pretix-wompi (2026-10-13)", "Resultado del diagnóstico", "Resultado: pedidos anteriores del mismo comprador".)
- **H1 (compra directa en la tienda) y H2 (se pierde en el navegador de Instagram):** descartadas. Un solo
  caso de cada una. ("Resultado del diagnóstico".)
- **El sitio no pierde la UTM:** comprobado en el sitio real, en 26 de 27 pedidos, con `CH3ZN` y con la
  tabla A de GA4. ("Respuestas de testigos-web (2026-10-13)", "Respuestas de testigos-web a la tabla de horas".)
- **El 12 de octubre nadie pulsó "Comprar" desde una visita de anuncio:** 19 `begin_checkout`, 10 directos y
  7 de Google. ("Resultado de las tablas de depuración en GA4".)
- **GA4 `(not set)` en las compras:** causa D6a, el plugin fijaba `timestamp_micros` fuera de la sesión.
  Lo corrige pretix-wompi (`982f155`). Confirmado hora por hora. ("GA4 no une la compra a la visita",
  "Confirmación hora por hora de la fila `(not set)`".)
- **Tabla B de GA4 (primera campaña del usuario):** no confiable hasta después de D6a. ("Resultado de las
  tablas de depuración en GA4".)
- **Correo a expirados del 12 de octubre:** llevaba UTM `expirados-2026`, salió a las 16:24 a 7 personas y
  no generó ventas. ("Resultado: horas de los compradores del 12 de octubre".)
- **Meta atribuye por persona, no por UTM:** 1 compra atribuida en todo el período (13 sep a 12 oct), a
  "Video Maria Elvira". El `Purchase` del plugin llega a Meta. ("Reporte de anuncios de Meta".)
- **Inventario de enlaces con UTM:** hecho en `enlaces-y-nombres.md`, con la regla de nombres sin ruido.
  ("Respuesta de testigos-web al encargo", "Cambio en la convención de nombres".)
- **El sitio no tenía enlaces que cambiar por el inventario;** solo cambiaron los documentos del chatbot.
  ("testigos-web: estado de los cuatro encargos".)
- **Slug de campaña:** obligatorio en cada evento. El real es `testigos-de-la-memoria-2026` (evento Pretix
  `testigos-memoria`); el de ensayo, `testigos-sandbox`. ("Preguntas abiertas" y respuestas del 2026-10-08.)
- **Nombre del comprador:** sale de la primera boleta. ("Preguntas de testigos-web (2026-10-08)".)
- **Valores `null` y claves ajenas en `widget_data`:** el plugin los trata como ausentes e ignora lo que no
  empieza por `tracking-`. ("testigos-web", foto del 2026-10-08.)
- **Vencimiento del WhatsApp:** el campo se lee en la zona horaria del evento. ("Respuestas de pretix-wompi (2026-10-08)".)
- **Vencer y reactivar:** si la señal falla, el barrido de 5 minutos lo recoge. ("Respuestas de pretix-wompi (2026-10-08)".)
- **Volver de 2026.5.4 a 2026.5.1:** se puede con "Redeploy" en Railway, sin restaurar el snapshot. Reabre
  el CVE-2026-13602. ("Respuestas de pretix-wompi (2026-10-08, tercera tanda)".)
- **Pedidos anteriores al plugin:** no tienen UTM en "Ventas por campaña"; Pretix no guarda el `widget_data`.
  ("Respuestas de pretix-wompi (2026-10-08)".)
- **Captura antes de confirmar el pedido:** versión futura, fuera de alcance. ("Preguntas abiertas", 2026-10-08.)

## Preguntas abiertas

- **Meta reporta unas 4.800 vistas de la página de destino y GA4 unos 685 usuarios en 28 días.** ¿El
  píxel está en otro dominio? ¿Cómo define Meta esa vista en su navegador interno? ¿GA4 deja de contar
  visitas? ¿Cuántos `PageView` recibió el píxel desde `testigosdelamemoria.com`? Responde: testigos-web
  (documentación de Meta y código), con el titular para el Administrador de eventos. Hasta entonces, no
  comparar cifras de Meta y GA4 en los informes. (Historial: "Reporte de anuncios de Meta".)
- **¿Aviso cuando el slug de campaña está vacío?** Responde: titular. Lo hace pretix-wompi si dice que sí.
- **Zona horaria de `testigos-sandbox` y `testigos-memoria` en Pretix:** debe ser `America/Bogota`. Responde: titular.
- **GA4 en la administración:** tiempo de espera de la sesión y zona horaria de la propiedad. No bloquean
  D6a. Responde: titular.
- **Consentimiento después de navegar:** ¿se quiere que `consent_granted` lleve las UTM guardadas? No está
  hecho ni propuesto. Comprobarlo en DebugView exige acceso a GA4. Responde: titular (con testigos-web).
- **Exportación CSV de pedidos con UTM en producción:** ¿ya se desplegó? Responde: backend.
- **Fricción en el pago** (un pedido desde el navegador de Instagram vencido, compradores con 3 intentos):
  no es de medición. ¿Se investiga? Responde: titular.

## Pendientes del titular

- Visto bueno para el push de testigos-web (9 commits de documentos, más este `estado.md` cuando se haga commit).
- Compra real pequeña desde `https://testigosdelamemoria.com/?utm_source=prueba&utm_campaign=verificacion-ga4`,
  con cookies aceptadas y en la misma visita. A las 24 a 48 horas, mirar en GA4 que salga en la fila
  `verificacion-ga4`.
- Prueba en el teléfono de "Abrir en el navegador" desde Instagram: pasos en el historial, "¿Dónde se puede
  perder la UTM?", "Prueba de teléfono". Anotar qué conserva la URL en Safari o Chrome y en la tienda.
- Dar los valores del afiche y del reel que ya circulan, y confirmar las campañas en uso.
- Copiar el prompt y la base de conocimiento del chatbot (`docs/system-prompt-atencion.md`,
  `docs/chatbot-conocimiento.md`) en su plataforma.
- Fuera de los repos: parámetros de URL por nombre en los anuncios de Meta (y revisar que cada anuncio activo
  los tenga), enlace de la bio con `utm_campaign`, repartir los enlaces a organizadores y panelistas, y
  definir el tráfico interno en GA4.
- Las respuestas marcadas "Responde: titular" en "Preguntas abiertas".
