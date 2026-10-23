# Testigos de la Memoria · sitio del evento y boletería

**Cliente:** Eventalist S.A.S.
**Evento:** Testigos de la Memoria. Encuentro de periodistas que cubrieron los últimos cincuenta años de Colombia, Villa de Leyva, 5 al 8 de noviembre de 2026.
**Sitio:** https://testigosdelamemoria.com
**Tienda:** https://pretix.eventalist.co/eventalist/testigos-memoria/
**Mi rol:** todo el proyecto, de punta a punta. Diseño de la experiencia, desarrollo del sitio, instalación y configuración de la boletería, integración de pagos con Wompi, SEO, analítica, despliegue y operación durante la venta.
**Tiempo:** de agosto a octubre de 2026, unos 250 commits.

---

## Qué es

Un sitio de evento hecho para vender. Presenta el encuentro, sus 14 panelistas y la agenda de cuatro días, y lleva a la compra sin pasos de más. Detrás hay una boletería completa sobre Pretix, autohospedada, con un plugin propio para cobrar con Wompi en pesos colombianos (tarjeta, PSE, Nequi, Bancolombia).

Lo que entrega:

- **Portada vendedora:** hero con las caras de los panelistas, tres cifras clave, carrusel de panelistas, tienda embebida, agenda, cómo llegar, qué es el encuentro y preguntas frecuentes.
- **Una página por panelista** con bio, credenciales, foto y las sesiones en las que participa, y **una página por charla** con resumen del tema y quiénes están en la mesa. Todo enlazado en las dos direcciones.
- **Páginas de apoyo:** charlas abiertas (entrada libre), cómo llegar, hoteles aliados con oferta para asistentes, términos y condiciones, política de tratamiento de datos y una portada en inglés.
- **Venta por etapas:** precios de preventa con fecha de cambio y avisos que se actualizan solos según la etapa vigente.
- **Formulario de interesados** conectado al backend de Eventalist para captar público antes de abrir la venta.

## Tecnologías

| Capa | Herramienta |
|---|---|
| Sitio | **Astro 5**, 100 % estático, TypeScript estricto, JavaScript vanilla |
| Estilos | CSS propio con tokens de diseño (sin frameworks ni librerías de UI) |
| Contenido | Módulos TypeScript tipados (`speakers.ts`, `agenda.ts`, `faqs.ts`, `event.ts`): el contenido es código validado en el build |
| Boletería | **Pretix** autohospedado en Railway, con widget embebido en la portada |
| Pagos | **Wompi** mediante un plugin de pago para Pretix desarrollado por mí |
| Hosting | GitHub Pages con despliegue por GitHub Actions (acciones fijadas por SHA) |
| Dominio | DNS en GoDaddy, HTTPS forzado |
| SEO | Metadatos por ruta con límites verificados en el build, JSON-LD (Organization, WebSite, Event con subeventos y ofertas, Person, migas), sitemap generado, imágenes para compartir por panelista generadas con script, IndexNow en cada despliegue |
| Analítica | Google Analytics 4 con Consent Mode y píxel de Meta, ambos solo tras aceptar cookies |
| Gestión del trabajo | Spec-driven development con Spec Kit: especificación, plan, investigación, contratos y tareas por feature |
| Desarrollo | Claude Code como par de programación |

Una sola dependencia de ejecución: `astro`. Nada más.

## Filosofía de desarrollo

1. **La compra manda.** SEO y analítica entran solo si no estorban la compra. Un aviso de cookies estándar y ningún paso extra. Si medir algo exige fricción, no se mide. Una capa de atribución de compras en servidor (webhooks, Conversions API) se diseñó y se retiró por desproporcionada para un evento único: las ventas se leen en Pretix.
2. **Estático y sin dependencias.** HTML que funciona sin JavaScript, movimientos con CSS e `IntersectionObserver`, respeto a `prefers-reduced-motion`. Carga rápida en un celular de gama media y poca superficie de ataque.
3. **El contenido es dato tipado.** Panelistas, agenda y preguntas viven en archivos TypeScript. Cambiar un panelista o una hora se refleja en la portada, su ficha, la página de la charla, el sitemap y el JSON-LD a la vez, y el build falla si algo no cuadra.
4. **Especificar antes de construir.** Cada feature grande (la landing, el bloque de SEO y medición) tiene su especificación, plan, contratos y lista de tareas, con decisiones documentadas y su porqué.
5. **Nada sale a producción sin revisión.** Trabajo en `dev`, publicación con merge a `main` solo con visto bueno del cliente. El workflow de despliegue nació inerte a propósito.
6. **Marca con reglas escritas.** Una fórmula visual documentada (bloques de color plano, duotono, sin gradientes) y reglas de redacción para que todo el sitio hable con una sola voz.
7. **Lo legal también es producto.** Política de tratamiento de datos y términos revisados contra la Ley 1581 de 2012, el Decreto 1377 de 2013 y la Ley 2300 de 2023.

## Boletería con Pretix

Pretix es un sistema de boletería de código abierto. En lugar de una plataforma con comisión por boleta, Eventalist tiene **su propia instancia** en `pretix.eventalist.co`, que sirve para este evento y para los siguientes.

Lo que configuré:

- **Productos:** pase completo y cuatro boletas de medio día, con cupos, precios por etapa y textos de venta propios.
- **Tienda con la marca del evento:** encabezado, colores, textos de portada, de confirmación, banners y ayudas de cada campo.
- **Boleta en PDF** con diseño propio y código QR para el control de acceso.
- **Escarapelas** en PDF para asistentes, panelistas, prensa y staff, generadas desde plantillas de diseño y listas de acreditación.
- **Correos automáticos** de pedido pagado y gratuito, firma y facturación.
- **Widget embebido** en la portada: la compra empieza en el sitio y el pago se abre en una pestaña segura de la tienda.

Los archivos de diseño de boleta, escarapelas y tienda, y los textos de cada campo de Pretix, quedaron versionados en el repositorio para replicarlos en el próximo evento.

## Plugin propio de Wompi para Pretix

Pretix no trae integración con Wompi, la pasarela más usada en Colombia. **Desarrollé un plugin de pago para Pretix que conecta con Wompi** y lo mantengo yo: no es un paquete público.

- Cobra en COP con los medios que ofrece Wompi: tarjetas, PSE, Nequi y Bancolombia.
- Crea la transacción con firma de integridad, lleva al comprador al checkout de Wompi y confirma el pago al volver y por webhook.
- Marca el pedido como pagado en Pretix, que entonces emite la boleta y manda el correo.

**Un caso real resuelto:** en producción, el pago desde la portada se quedaba cargando. El diagnóstico mostró que el widget abría el checkout dentro de un iframe, y Bancolombia y PSE se niegan a cargar dentro de marcos de otros sitios (`X-Frame-Options`). Se resolvió el mismo día abriendo la tienda en una pestaña propia desde el widget, sin tocar la experiencia del resto del sitio.

## Despliegue y operación

- Cada push a `main` construye el sitio y lo publica en GitHub Pages. Al terminar, avisa a los buscadores por IndexNow.
- **Revisión de seguridad** del proyecto: dependencias al día, acciones de CI fijadas por SHA, enlaces siempre con `https://`. Se detectó que en Colombia el tráfico HTTP hacia GitHub Pages se redirige a la página de Coljuegos, y se documentó la solución con Cloudflare (HTTPS siempre y HSTS).
- **Auditoría SEO** de un consultor externo convertida en tareas, con decisión documentada por cada punto.
- **Chatbot de Instagram** con ManyChat alineado con los textos y enlaces del sitio.
- Documentación para los socios del evento sobre cómo funcionan el SEO y la analítica.

## Qué puedo ofrecer con esto

Un paquete repetible para cualquier evento con venta de boletas:

- Sitio rápido, con la marca del evento y pensado para convertir.
- Boletería propia en Pretix, sin comisión de plataforma por boleta, con boletas, escarapelas y correos con el diseño del evento.
- Cobro en pesos colombianos con Wompi gracias al plugin propio.
- SEO técnico, analítica con consentimiento y textos legales en regla.
- Acompañamiento durante la venta: cambios de etapa, ajustes de agenda y panelistas, y soporte si algo falla en el pago.
