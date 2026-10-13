# Estándar de medición para los eventos de Eventalist

Fecha: 2026-10-13. Nace de Testigos de la Memoria y se aplica a todo evento nuevo.

## Por qué

Además de vender el evento, el producto de Eventalist es que el cliente que nos contrató vea el trabajo en números, también en las semanas en que no hay ventas. Cada persona que se acerca a comprar es un resultado que se puede mostrar: visitó, se interesó, dejó sus datos, pulsó comprar, confirmó un pedido. Si un punto de captura no se mide, ese trabajo no existe en el informe.

**Regla:** nada que capture personas o intención de compra se publica sin su evento de medición, su lugar en el informe y la revisión legal.

## La escalera de números

Es el orden en que se presenta el informe al cliente, de lo más amplio a la venta. Para cada escalón, de dónde sale el número.

1. **Personas alcanzadas por los anuncios.** Meta, Administrador de anuncios (alcance e impresiones).
2. **Visitas al sitio.** GA4, Adquisición de tráfico, por canal y campaña.
3. **Fueron a ver las boletas.** GA4, evento `view_item_list` (Meta `ViewContent`).
4. **Dejaron sus datos como interesados.** Backend de Eventalist, contactos de la campaña (número completo). GA4, evento `generate_lead` (Meta `Lead`), para saber de qué campaña vinieron.
5. **Preguntaron por WhatsApp.** GA4, evento `contact`, y las conversaciones del chatbot.
6. **Pulsaron "Comprar".** GA4, evento `begin_checkout` (Meta `InitiateCheckout`).
7. **Confirmaron un pedido sin pagar.** Pretix y backend (etapa "confirmó y no pagó"). GA4 `add_payment_info` y Meta `AddPaymentInfo`, desde el plugin.
8. **Pagaron.** Pretix (fuente de verdad del total) y backend. GA4 `purchase` y Meta `Purchase`, desde el plugin.
9. **Recuperados.** Pedidos que llegaron con `utm_medium=recuperacion` (correos y WhatsApp a quien no terminó la compra).

GA4 y Meta solo ven a quien acepta cookies: sirven para comparar campañas, no para los totales. Los totales de los escalones 4, 7 y 8 salen del backend y de Pretix.

## Antes de publicar un punto de captura nuevo

Un formulario, un botón de compra, un enlace de WhatsApp, un canal nuevo:

- [ ] Tiene su evento en `src/measurement/tags.ts`, con nombre recomendado de GA4 si existe (`generate_lead`, `begin_checkout`, `purchase`, `contact`) y su par en Meta. Sin datos de la persona en los parámetros.
- [ ] `abogado-eventalist` revisó si la sección 10 de la política lo cubre (así se agregó la inscripción en la lista de interesados el 2026-10-13).
- [ ] En GA4: marcado como evento clave si es un escalón de la escalera, y sus parámetros propios registrados como dimensiones personalizadas.
- [ ] Tiene su línea en `titular/reportes-para-el-informe.md` (qué exportar) y en la escalera de arriba.
- [ ] Probado en el sitio local: el evento aparece en GA4, Informes, Tiempo real.

## Configuración de cada propiedad de GA4 nueva

Una sola vez, el día en que se crea. Nada de esto es retroactivo. Rutas de menú en `titular/reportes-para-el-informe.md`, sección "Configuración pendiente en GA4".

- [ ] Conservación de datos de eventos: 14 meses.
- [ ] Eventos clave: `generate_lead`, `add_payment_info` y `purchase`. Quitar las sugerencias que nada envía (`close_convert_lead`, `qualify_lead`).
- [ ] Dimensiones personalizadas de evento: `atribucion`, `lead_source`, `franja` (o el equivalente del producto del evento).
- [ ] Referencias no deseadas: `pretix.eventalist.co` y `checkout.wompi.co`.
- [ ] Secreto de Measurement Protocol para el plugin de Pretix.

## Lo demás que ya es estándar

- Quien maneja las redes sigue `guia-manager-redes.md` desde el día en que se crean los perfiles.
- Evento sandbox en Pretix por cada evento (`titular/evento-sandbox.md`).
- Plugin de Pretix activo en el evento real antes de la primera venta, para que ningún pedido quede sin campaña.
- Campaña guardada en el navegador hasta 30 días (`src/measurement/attribution.ts`), con su frase en la política (en Testigos, pendiente de publicar al 2026-10-13).
