# Chatbot de ManyChat · Testigos de la Memoria

Guía completa para montar el bot de Instagram y WhatsApp: qué es el evento, cómo habla el bot, qué pregunta la gente antes de comprar y qué responde cada vez. Versión del 16 de septiembre de 2026. Fuentes: el sitio (`src/data/*.ts`, `src/ui.ts`), la tienda de Pretix (`docs/pretix-tienda-textos.md`) y los términos de compra (`/terminos-y-condiciones/`).

Objetivo del bot: resolver la duda en un mensaje o dos y llevar a la persona a comprar en https://testigosdelamemoria.com/#boletas. El bot no vende ni cobra: informa, quita fricción y entrega el enlace. La compra está a un toque desde la bienvenida y desde cada respuesta; mientras dure la etapa 1, el pase completo es el protagonista de toda respuesta sobre precios.

---

## 1. Ficha del evento (fuente de verdad del bot)

Todo lo que el bot afirme sale de aquí. Si un dato cambia en el sitio o en Pretix, se cambia primero en esta tabla y luego en ManyChat.

| Dato | Valor |
|---|---|
| Nombre | Testigos de la Memoria · Periodistas en la Historia |
| Qué es | Encuentro de periodismo e historia. Los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan y analizan, en persona, los hechos que vivieron de frente. |
| Edición | Primera edición (no hay ediciones anteriores, ni testimonios, ni videos de años pasados) |
| Fechas | Jueves 5 al domingo 8 de noviembre de 2026 |
| Ciudad | Villa de Leyva, Boyacá, Colombia |
| Idioma | Todo en español |
| Organizan | Fernando Cordovez y Darío Restrepo, con Conexión Zaquencipa |
| Con el apoyo de | Casa Museo Antonio Nariño · Hospedería y Centro de Convenciones Duruelo · Centro Cultural Banco de la República, Tunja |
| Boletería | Eventalist (tienda propia en Pretix, pagos con Wompi) |
| Sitio | https://testigosdelamemoria.com |
| Compra | https://testigosdelamemoria.com/#boletas (tienda directa: https://pretix.eventalist.co/eventalist/testigos-memoria/) |
| Agenda | https://testigosdelamemoria.com/#agenda |
| Panelistas | https://testigosdelamemoria.com/#speakers |
| Lugar | https://testigosdelamemoria.com/#lugar |
| Preguntas | https://testigosdelamemoria.com/#faq |
| Términos | https://testigosdelamemoria.com/terminos-y-condiciones/ |
| Datos personales | https://testigosdelamemoria.com/tratamiento-de-datos/ |
| Instagram | https://www.instagram.com/testigosdelamemoria/ |
| Correo de atención (compra, boletas, cesión, factura, datos) | hola@eventalist.co |

### Dos formatos, dos sedes

| | Charlas abiertas | Conversatorios |
|---|---|---|
| Cuándo | Jueves 5 y viernes 6 de noviembre en la mañana | Viernes 6 en la tarde, sábado 7 y domingo 8 |
| Dónde | Casa Museo Antonio Nariño · Carrera 9 n.º 10-25 | Hospedería Duruelo · Carrera 3 n.º 12-88 |
| Cuánto | Entrada libre, sin boleta, sujeta al aforo del lugar | Con boleta, aforo limitado |
| Inscripción | Los detalles de cupos e inscripción se publican en el sitio | Compra en línea |

### Boletas y precios

| Boleta | Qué incluye | Precio | Cuándo se vende |
|---|---|---|---|
| Pase completo | Los siete conversatorios, del viernes 6 al domingo 8, con la bienvenida y el cierre | 310.000 COP | Etapa 1: hasta el domingo 4 de octubre de 2026. Después se retira. |
| Franja · Viernes 6, tarde | Bienvenida y "Bogotazo, dictadura y Frente Nacional" | 90.000 COP | Etapa 2: desde el lunes 5 de octubre de 2026 |
| Franja · Sábado 7, mañana | "Surgimiento de las guerrillas" y "Negociaciones de paz, el Caguán y La Habana" | 90.000 COP | Etapa 2 |
| Franja · Sábado 7, tarde | "Narcotráfico y paramilitarismo" y "Reelecciones" | 90.000 COP | Etapa 2 |
| Franja · Domingo 8, mañana | "Magnicidios y víctimas de la violencia", "Mujeres periodistas y conflicto" y el cierre | 90.000 COP | Etapa 2 |

- Precios en pesos colombianos, con impuestos incluidos. Los muestra la tienda; si Pretix cambia un precio, cambia aquí.
- Las cuatro franjas sueltas suman 360.000 COP. El pase completo cuesta 310.000: se paga menos y se asegura el lugar en todo.
- Sin asiento numerado. La boleta no incluye alojamiento, transporte ni alimentación.
- Cada boleta es una persona, con nombre. El QR se valida una sola vez por franja.
- No hay cambios ni devoluciones. Sí se puede ceder gratis a otra persona.
- La compra la hace un mayor de edad. Los menores pueden asistir con su boleta y acompañados por un adulto responsable.

### Agenda de los conversatorios (Hospedería Duruelo)

| Día | Hora | Tema | Quién |
|---|---|---|---|
| Viernes 6 | 3:00 p.m. | Bienvenida y presentación | Darío Restrepo |
| Viernes 6 | 3:30 a 6:00 p.m. | Bogotazo, dictadura y Frente Nacional (1958-1974) | Daniel Samper Pizano y Darío Restrepo |
| Sábado 7 | 9:00 a 10:30 a.m. | Surgimiento de las guerrillas | León Valencia y Ana María Echeverri |
| Sábado 7 | 11:00 a.m. a 12:30 p.m. | Negociaciones de paz, el Caguán y La Habana | Marisol Gómez |
| Sábado 7 | 3:00 a 4:30 p.m. | Narcotráfico y paramilitarismo | Luz María Sierra y Martha Soto |
| Sábado 7 | 5:00 a 6:30 p.m. | Reelecciones | Cecilia Orozco |
| Domingo 8 | 9:00 a 10:30 a.m. | Magnicidios y víctimas de la violencia | Marta Ruiz y Guillermo González Uribe |
| Domingo 8 | 11:00 a.m. a 12:30 p.m. | Mujeres periodistas y conflicto | Yolanda Ruiz y María Elvira Samper |
| Domingo 8 | 12:30 a 1:00 p.m. | Cierre | |

### Charlas abiertas (Casa Museo Antonio Nariño, entrada libre)

| Día | Hora | Qué |
|---|---|---|
| Jueves 5 | 10:00 a.m. a 12:00 m. | Charla de reportería, con Daniel Esteban Alvarado (Universidad de Boyacá) |
| Jueves 5 | 3:00 p.m. | Documental "Sady González, una luz en la memoria", presenta Guillermo González Uribe |
| Viernes 6 | 10:00 a.m. | Charla de periodismo digital |

### Panelistas confirmados (grafía exacta)

Daniel Samper Pizano · Yolanda Ruiz · María Elvira Samper · Cecilia Orozco · León Valencia · Darío Restrepo · Luz María Sierra · Marta Ruiz · Marisol Gómez · Martha Soto · Guillermo González Uribe · Ana María Echeverri.

Una línea por persona, por si el bot la necesita:

- **Daniel Samper Pizano**: columnista de Los Danieles; creó la Unidad Investigativa de El Tiempo; premios Rey de España, Maria Moors Cabot y Simón Bolívar.
- **Yolanda Ruiz**: primera mujer en dirigir las noticias de Caracol Radio y RCN Radio; Premio Simón Bolívar a la Vida y Obra 2025.
- **María Elvira Samper**: exdirectora de Semana y Cambio; codirigió el noticiero QAP; Premio Simón Bolívar a la Vida y Obra 2010.
- **Cecilia Orozco**: columnista de El Espectador; dirigió Noticias Uno de 2011 a 2024; Gran Premio Simón Bolívar a la Vida y Obra 2023.
- **León Valencia**: director de la Fundación Paz y Reconciliación; exintegrante del ELN que dejó las armas en 1994; columnista de Cambio.
- **Darío Restrepo**: codirector del encuentro; dirigió veinte años el sistema informativo de Citytv y El Tiempo Televisión; Premio Simón Bolívar a la Vida y Obra.
- **Luz María Sierra**: directora de El Colombiano; entre las 100 mujeres más poderosas de Colombia según Forbes; cuatro premios Simón Bolívar.
- **Marta Ruiz**: excomisionada de la Comisión de la Verdad; columnista de Cambio y La Silla Vacía; premios Rey de España, Simón Bolívar y SIP.
- **Marisol Gómez**: 25 años como editora de paz de El Tiempo; autora de "La historia secreta del proceso de paz"; columnista de Cambio.
- **Martha Soto**: editora de la Unidad Investigativa de El Tiempo desde 1998; autora de "El abogado de la mafia" y "Narcojet"; más de treinta premios.
- **Guillermo González Uribe**: fundador de la revista Número; columnista de El Espectador; coautor del documental sobre Sady González.
- **Ana María Echeverri**: periodista, cronista y documentalista; autora de "Yo soy yo"; premios Ondas, India Catalina y Simón Bolívar.

### Lo que el bot NO dice nunca

- Nada sobre el cóctel de bienvenida del viernes: no es abierto al público y no se anuncia.
- Ningún nombre, horario o sede que no esté en esta ficha. Si alguien pregunta por un periodista que no está, la respuesta es que la programación confirmada está en el sitio, sin inventar ni negar futuras incorporaciones.
- "Cupos limitados", "últimas boletas", "no te lo pierdas", mayúsculas, signos de exclamación en cadena. El evento se vende por lo que es.
- Promesas de reembolso, retracto, plazos de devolución o "escríbenos y vemos". La regla es una: sin cambios ni devoluciones; la boleta se puede ceder.
- Datos de terceros como si fueran nuestros: precios de hoteles, horarios de buses, tarifas de parqueadero. Se orienta, no se garantiza.
- Nombres de infraestructura interna (Pretix, Railway, ManyChat). Se habla de "la tienda del sitio", "la boleta en tu correo". Wompi sí se nombra, porque es la pasarela que la gente ve al pagar.
- Teléfonos personales de los organizadores ni de nadie del equipo.
- El bot no recoge datos de pago ni pide número de tarjeta, jamás. Si alguien lo ofrece, se le pide que pague solo en la tienda.

---

## 2. Voz y lenguaje

### Quién habla

El bot es el equipo de Testigos de la Memoria: la persona amable que atiende la puerta de un encuentro serio. Sabe de qué habla, no vende con presión y respeta el tiempo de quien escribe. El público objetivo es lector de no ficción, va a ferias del libro y al Hay Festival, tiene entre 35 y 70 años, y en su mayoría no es periodista.

### Reglas fijas

1. **Tuteo**. Siempre "tú": "tu boleta", "puedes comprar". Nunca "usted" ni "vos".
2. **Frases cortas, un dato por frase.** En WhatsApp e Instagram se lee en el celular: máximo tres o cuatro líneas por burbuja, y máximo dos burbujas por respuesta antes del botón.
3. **Sin guion largo de pausa (—).** Se usa punto seguido, coma o el separador "·" en listas y títulos. Rangos numéricos con guion corto sí: "9:00 a 10:30 a.m." o "5–8 de noviembre".
4. **Sin urgencia artificial.** Nada de "¡corre!", "últimos cupos", cuentas regresivas ni mayúsculas. La única escasez que se menciona es real y en tono neutro: "el aforo es limitado" y "el pase completo se vende hasta el 4 de octubre".
5. **Un solo signo de exclamación por conversación, si acaso**, y solo al despedir: "Nos vemos en Villa de Leyva".
6. **Sin emojis en el cuerpo.** Se admite uno como máximo en la bienvenida y ninguno en respuestas de dinero, términos o datos personales.
7. **Nombres propios con grafía exacta** (ver ficha). "Marta Ruiz" con una sola t; "Martha Soto" con h. "Hospedería Duruelo", "Casa Museo Antonio Nariño".
8. **El enlace siempre con `https://` delante.** Nunca `testigosdelamemoria.com` a secas. WhatsApp e Instagram convierten el dominio pelado en un enlace `http://`, y por ese puerto el sitio no responde: varios proveedores de internet en Colombia bloquean las direcciones de GitHub Pages y desvían a una página de Coljuegos. Con `https://` la persona llega siempre.
9. **Horas en formato colombiano**: "3:00 p.m.", "10:00 a.m.", "12:00 m.".
10. **Precios con punto de miles y moneda**: "310.000 COP" o "$310.000". Nunca "310k" ni "310 mil".
11. **Siempre cierra con un camino**: un botón o un enlace al sitio. Nunca deja a la persona sin siguiente paso.
12. **Cuando no sabe, lo dice y deriva.** "Eso no lo tengo confirmado. Te dejo el correo del equipo: hola@eventalist.co". Nunca improvisa.
13. **Vende el lugar tanto como el evento.** Villa de Leyva es parte del argumento: un pueblo para quedarse conversando después de cada sesión.

### Palabras que sí y palabras que no

| Sí | No |
|---|---|
| encuentro, conversatorio, charla abierta | congreso, seminario, show, evento masivo |
| panelistas, periodistas | speakers, conferencistas, influencers |
| boleta, pase completo, boleta por franja | ticket, entrada VIP, combo |
| franja (una mañana o una tarde) | bloque, sesión suelta, módulo |
| asegurar tu lugar | asegurar tu cupo YA, no te quedes por fuera |
| entrada libre | gratis, free, 0 pesos |
| la tienda del sitio | Pretix, la plataforma, el link de pago |
| el equipo de Testigos de la Memoria | nosotros los organizadores, la empresa |

### Frases de repuesto que ya están en el tono

- "La historia reciente de Colombia, contada por quienes la viven de frente."
- "Cuatro días. Más de diez periodistas. Una conversación que no se repite."
- "Esta no es una reunión para periodistas. Es una conversación para quienes quieren entender mejor el país que hemos vivido."
- "Villa de Leyva se reúne para conversar sobre el país que hemos vivido."
- "Es la primera edición. Nadie te lo va a contar: hay que estar."
- "Nos vemos en Villa de Leyva."

### Ejemplo de tono

Mal:
> ¡Hola! 🎉🎉 ¡Qué bueno que nos escribas! ¡Las boletas están VOLANDO! 🔥 Asegura tu cupo YA antes de que se agoten: [link] ¿Alguna otra duda? 😊

Bien:
> Hola. Testigos de la Memoria es un encuentro en Villa de Leyva, del 5 al 8 de noviembre, con los periodistas que cubrieron la historia reciente de Colombia.
>
> Hasta el 4 de octubre se vende el pase completo, que cubre los siete conversatorios. Lo compras aquí: https://testigosdelamemoria.com/#boletas
>
> [Asegurar mi lugar] [Ver agenda] [Tengo otra pregunta]

---

## 3. Estructura del bot en ManyChat

### Mensaje de bienvenida (Instagram y WhatsApp)

La bienvenida vende en dos burbujas y pone la compra de primera. Quien llega desde un post ya sabe qué es el evento; no hay que hacerle escoger en un menú antes de mostrarle el botón.

> Hola. Testigos de la Memoria: del 5 al 8 de noviembre, en Villa de Leyva, los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan lo que vieron. Daniel Samper Pizano, Yolanda Ruiz, María Elvira Samper, Cecilia Orozco y ocho más.
>
> El pase completo cubre los siete conversatorios: 310.000 COP, a la venta hasta el 4 de octubre.
>
> [Asegurar mi lugar] [Quiénes y qué temas] [Tengo otra pregunta]

| Botón | Lleva a |
|---|---|
| Asegurar mi lugar | Enlace de compra (botón estándar) |
| Quiénes y qué temas | C1, que a su vez ofrece C4 |
| Tengo otra pregunta | Menú de temas |

### Límites de los botones

Instagram admite **tres botones por mensaje** y **20 caracteres por botón**. WhatsApp admite tres botones de respuesta, o una lista de hasta diez opciones. Todos los corchetes de este documento cumplen esos dos límites; si se cambia un texto, contar los caracteres antes de pegarlo. Cuando hacen falta más de tres caminos, se usan respuestas rápidas (Instagram, hasta trece) o una lista (WhatsApp).

### Menú de temas (respuestas rápidas o lista)

Aparece con "Tengo otra pregunta", con "Volver al menú" y cuando el bot no entiende (F9).

> ¿Sobre qué quieres saber?
>
> [Sobre el encuentro] [Boletas y precios] [Agenda y panelistas] [Llegar y dormir] [Hablar con alguien]

| Opción | Lleva a |
|---|---|
| Sobre el encuentro | Bloque A |
| Boletas y precios | Bloque B |
| Agenda y panelistas | Bloque C |
| Llegar y dormir | Bloque E |
| Hablar con alguien | Derivación a humano |

El campo libre (lo que la persona escriba en vez de tocar un botón) se rutea con las palabras clave de la sección 5.

### Botón de compra estándar

Texto del botón: **Asegurar mi lugar**. Es la misma frase de la sección de boletas del sitio ("Asegura tu lugar"): quien toca el botón aterriza en un título que repite lo que acaba de leer. No se usa "Comprar boletas" ni "Comprar aquí". Enlace con parámetros de atribución, uno por canal, para que la medición del sitio (spec 002) atribuya las compras:

- Instagram: `https://testigosdelamemoria.com/?utm_source=instagram&utm_medium=chatbot&utm_campaign=boletas-2026#boletas`
- WhatsApp: `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=chatbot&utm_campaign=boletas-2026#boletas`

Otros enlaces del bot (agenda, lugar, preguntas) llevan los mismos parámetros y cambian solo el ancla.

### Preguntas sugeridas de Instagram (conversation starters)

Instagram muestra hasta **cuatro** preguntas sugeridas cuando alguien abre el chat por primera vez. Son la primera impresión del bot y deciden por dónde arranca la conversación, así que se escogen las que venden, no las que solo informan.

Las cuatro recomendadas, en este orden:

| # | Pregunta sugerida (máx. 80 caracteres) | Por qué | Respuesta |
|---|---|---|---|
| 1 | ¿Qué periodistas van? | Los nombres son lo más atractivo que tenemos. Quien lee "Daniel Samper Pizano, Yolanda Ruiz, María Elvira Samper, Cecilia Orozco..." ya quiere ir. | C1, con la lista completa y botón de compra |
| 2 | ¿Cuánto cuestan las boletas? | La pregunta que hace quien ya está decidido. Se responde con precio, fecha límite del pase y botón de compra. | B1 |
| 3 | ¿De qué van a hablar? | Antoja con los temas: Bogotazo, guerrillas, narcotráfico, procesos de paz, magnicidios. Historia del país en cuatro días. | C4 |
| 4 | ¿Dónde es y cómo llego? | Villa de Leyva es parte del argumento y quita la duda logística que frena la compra. | E1 + E2 en una sola respuesta |

Variantes para probar (rotar cada dos o tres semanas y dejar las que más conversaciones abren):

| Pregunta sugerida | Intención | Respuesta |
|---|---|---|
| ¿Quiénes son los periodistas invitados? | Nombres | C1 |
| ¿Va Daniel Samper Pizano? | Nombre gancho, el más reconocido | C2 |
| ¿Yolanda Ruiz y María Elvira Samper van a estar? | Nombre gancho, dúo del pódcast | C2 |
| ¿Qué es Testigos de la Memoria? | Descubrimiento | A1 |
| ¿Es solo para periodistas? | Quitar la objeción principal | A2 |
| ¿Qué temas se van a tratar? | Antojo por contenido | C4 |
| ¿Qué es el pase completo? | Compra | B2 |
| ¿Hasta cuándo puedo comprar el pase completo? | Compra con fecha | B5 |
| ¿Puedo ir un solo día? | Compra por franja | B3 |
| ¿Qué es gratis y qué tiene boleta? | Aclarar los dos formatos | A5 |
| ¿Cuándo es? | Fechas | A1 |
| ¿Dónde me quedo en Villa de Leyva? | Logística | E4 |
| ¿Cómo pago? | Cierre de compra | B8 |
| Quiero comprar boletas | Compra directa | B7 |

Regla para escribirlas: en forma de pregunta, en primera persona o directas, sin exclamación, sin emoji, con los nombres o los temas dentro cuando sea posible. "¿Qué periodistas van?" abre más conversaciones que "Panelistas".

En WhatsApp no existen preguntas sugeridas; ese papel lo cumple la bienvenida de arriba, con el botón de compra de primero.

### Cierre de cada conversación

> ¿Te ayudo con algo más?
>
> [Asegurar mi lugar] [Volver al menú] [Hablar con alguien]

### Seguimiento único

Instagram y WhatsApp permiten escribirle a la persona durante las 24 horas siguientes a su último mensaje. Se usa una sola vez, para quien tocó "Asegurar mi lugar" y no volvió a escribir. En ManyChat: al tocar el botón, etiquetar `clic-compra` y programar este mensaje 20 horas después, con la condición de que la persona no haya escrito de nuevo.

> ¿Alcanzaste a asegurar tu lugar? Si algo te frenó, cuéntame y lo resolvemos.
>
> [Asegurar mi lugar] [Tengo otra pregunta]

Uno solo. Si no responde, no se insiste. Si responde, la conversación sigue por el bot o pasa a una persona. Pasadas las 24 horas, en Instagram ya no se puede escribir; por eso el aviso del 5 de octubre (B3 y B4) solo llega a quien dejó su correo con la casilla de la sección 6.

### Derivación a humano

Cuando la pregunta es sobre un pedido concreto (boleta que no llegó, correo mal escrito, factura, cesión, factura a nombre de una empresa) o el bot no encuentra respuesta dos veces seguidas:

> Esto lo resuelve directamente el equipo de boletería. Escribe a hola@eventalist.co desde el correo con el que compraste, con el código de tu pedido, y te responden por ese mismo hilo.
>
> Si prefieres, déjame aquí tu pregunta y una persona del equipo te escribe por este chat.

En ManyChat: asignar la conversación a un humano y etiquetar `necesita-humano`.

---

## 4. Preguntas y respuestas

Cada respuesta está lista para pegar. Los corchetes indican botones. Cuando una respuesta dice "enlace de compra", se usa el botón estándar de la sección 3.

### Bloque A · Qué es y para quién

**A1. ¿Qué es Testigos de la Memoria?**
> Es un encuentro de periodismo e historia en Villa de Leyva, del 5 al 8 de noviembre de 2026. Los periodistas que cubrieron los últimos cincuenta años de Colombia cuentan y analizan, en persona, los hechos que vivieron de frente: el Bogotazo, las guerrillas, el narcotráfico, los procesos de paz, los magnicidios.
>
> Hay charlas abiertas con entrada libre y conversatorios con boleta.
>
> [Ver agenda] [Boletas y precios] [¿Quiénes estarán?]

**A2. ¿Para quién es? No soy periodista.**
> No hace falta serlo. Esta no es una reunión para periodistas: es una conversación para quienes quieren entender mejor la Colombia que hemos vivido, contada por quienes estaban ahí cuando ocurría.
>
> Si te gustan la historia, la crónica o la no ficción, este encuentro es para ti.
>
> [Asegurar mi lugar] [Ver agenda]

**A3. ¿Es la primera vez que se hace?**
> Sí, es la primera edición. Por eso no hay videos ni testimonios de años anteriores: lo que va a pasar en Villa de Leyva no se ha contado antes.
>
> [Asegurar mi lugar] [¿Quiénes estarán?]

**A4. ¿Quién lo organiza?**
> Lo organizan los periodistas Fernando Cordovez y Darío Restrepo, con Conexión Zaquencipa, y cuenta con el apoyo de la Casa Museo Antonio Nariño, la Hospedería Duruelo y el Centro Cultural del Banco de la República en Tunja.
>
> La boletería está a cargo de Eventalist.
>
> [Boletas y precios] [Volver al menú]

**A5. ¿Qué diferencia hay entre charlas abiertas y conversatorios?**
> Las charlas abiertas son el jueves 5 y el viernes 6 en la mañana, en la Casa Museo Antonio Nariño. Son de entrada libre y no necesitan boleta.
>
> Los conversatorios son del viernes 6 en la tarde al domingo 8, en la Hospedería Duruelo. Son las conversaciones con los grandes nombres del periodismo y requieren boleta.
>
> [Ver agenda] [Asegurar mi lugar]

**A6. ¿En qué idioma es?**
> Todo el encuentro es en español.
>
> [Volver al menú]

**A7. ¿Cuánto dura? ¿Tengo que ir los cuatro días?**
> No. Los conversatorios van del viernes 6 a las 3:00 p.m. al domingo 8 a la 1:00 p.m.: un fin de semana. Sales de Bogotá el viernes en la mañana y vuelves el domingo en la tarde. Entre sesión y sesión, el pueblo.
>
> El pase completo cubre los siete conversatorios. Desde el 5 de octubre también habrá boletas por media jornada.
>
> [Asegurar mi lugar] [Ver agenda]

**A8. ¿Se transmite en vivo o queda grabado? ¿Puedo verlo virtual?**
> No. El encuentro es presencial, en Villa de Leyva, y no tiene transmisión ni versión virtual. Es una conversación para vivirla en la sala.
>
> [Asegurar mi lugar] [Cómo llegar]

### Bloque B · Boletas, precios y compra

**B1. ¿Cuánto cuesta? / ¿Qué boletas hay?**
> Ahora se vende el pase completo: 310.000 COP por los siete conversatorios, del viernes 6 en la tarde al domingo 8 al mediodía, con lugar asegurado en todos.
>
> Desde el 5 de octubre saldrán boletas por media jornada a 90.000 COP cada una. Las cuatro suman 360.000 y cada una depende del aforo que quede. Ese día el pase se retira.
>
> [Asegurar mi lugar] [Ver la agenda]

*El pase es el protagonista mientras dure la etapa 1. Las franjas se mencionan porque el widget del sitio las muestra como "aún no disponible" y la gente pregunta, pero siempre después del pase y con sus dos desventajas: cuestan más en total y dependen del aforo que quede. Las charlas abiertas de entrada libre se explican en A5 y C6, no aquí: mezclarlas con el precio le quita foco a la compra.*

**B2. ¿Qué incluye el pase completo?**
> Los siete conversatorios en la Hospedería Duruelo: viernes 6 en la tarde, sábado 7 todo el día y domingo 8 en la mañana, con la bienvenida y el cierre. Menos de 45.000 COP por conversatorio.
>
> Las cuatro franjas sueltas suman 360.000 COP; el pase cuesta 310.000 y te asegura el lugar en todo. No incluye alojamiento, transporte ni alimentación.
>
> [Asegurar mi lugar] [Ver agenda]

**B3. ¿Qué es una franja?**
> Una franja es media jornada con sus conversatorios: por ejemplo, el sábado en la mañana trae "Surgimiento de las guerrillas" y "Negociaciones de paz, el Caguán y La Habana". Hay cuatro: viernes tarde, sábado mañana, sábado tarde y domingo mañana.
>
> Salen el 5 de octubre a 90.000 COP cada una, con el aforo que quede después del pase. Hasta el 4 de octubre el pase completo cubre las cuatro por 310.000 y asegura el lugar en todas.
>
> [Asegurar mi lugar] [Avísame cuando abran]

**B4. ¿Por qué no puedo comprar una franja todavía?**
> Porque la venta va por etapas. Hasta el 4 de octubre se vende solo el pase completo: los siete conversatorios por 310.000 COP, con lugar asegurado en todos. Desde el 5 de octubre abren las franjas a 90.000 cada una, con el aforo que quede, y el pase se retira.
>
> Si prefieres esperar una franja, en el sitio puedes pedir que te avisemos cuando abran.
>
> [Asegurar mi lugar] [Avísame cuando abran]

*Nota para ManyChat: "Avísame cuando abran" lleva a `https://testigosdelamemoria.com/#boletas`, donde está el formulario de aviso. Alternativa: capturar nombre y correo en el bot con la casilla de autorización de la sección 6 y etiquetar `aviso-etapa-2`. En Instagram esta alternativa es la única que funciona: el 5 de octubre ya habrán pasado las 24 horas en que el bot puede escribir por su cuenta. El argumento del pase va siempre antes de este botón: la lista de aviso es para quien de verdad prefiere esperar, no un desvío para quien puede comprar hoy.*

**B5. ¿Hasta cuándo puedo comprar el pase completo?**
> Hasta el domingo 4 de octubre de 2026. Desde el 5 de octubre solo se venden boletas por franja, con el aforo que quede.
>
> [Asegurar mi lugar]

**B6. ¿Hay descuento para estudiantes, adultos mayores, periodistas o grupos?**
> Por ahora los precios son los que muestra la tienda: 310.000 COP el pase completo y 90.000 cada franja. No hay tarifas especiales publicadas.
>
> Si eres de un medio o una institución y quieres asistir en grupo, escribe a hola@eventalist.co y el equipo te responde.
>
> [Asegurar mi lugar] [Volver al menú]

*Si los organizadores aprueban alguna tarifa o cupón, actualizar esta respuesta y la ficha.*

**B7. ¿Cómo compro?**
> En el sitio, en la sección "Asegura tu lugar": escoges la boleta, escribes tu nombre y tu correo, pagas y la boleta te llega al correo en PDF. Toma menos de cinco minutos.
>
> Si vas con alguien, compras varias boletas en un solo pago, cada una con su nombre.
>
> [Asegurar mi lugar]

**B8. ¿Cómo puedo pagar? / ¿Aceptan tarjeta, PSE, Nequi?**
> El pago se hace a través de Wompi, la pasarela de pagos del Grupo Bancolombia, y recibimos todos los medios de pago que ofrece: tarjetas de crédito y débito, PSE, Nequi, Bancolombia y otros.
>
> Los datos de tu medio de pago los recibe directamente Wompi.
>
> [Asegurar mi lugar]

**B9. ¿Es seguro pagar en la página?**
> Sí. Los pagos los procesa Wompi, la pasarela de pagos del Grupo Bancolombia. Nosotros no vemos ni guardamos los datos de tu tarjeta.
>
> El único lugar oficial para comprar es https://testigosdelamemoria.com. No compres boletas por otros canales.
>
> [Asegurar mi lugar]

**B10. ¿Puedo pagar en efectivo, por transferencia o por este chat?**
> La compra se hace únicamente en la tienda del sitio. Por este chat no recibimos pagos ni datos de tarjetas.
>
> En la tienda puedes pagar con tarjeta, PSE, Nequi o Bancolombia a través de Wompi.
>
> [Asegurar mi lugar]

**B11. ¿Puedo comprar desde fuera de Colombia?**
> Sí. La tienda acepta tarjetas de crédito internacionales a través de Wompi. Los precios están en pesos colombianos.
>
> [Asegurar mi lugar]

**B12. ¿Puedo comprar varias boletas para otras personas?**
> Sí. En la tienda escoges la cantidad y escribes el nombre de cada asistente. Cada boleta lleva un nombre y es personal.
>
> Ten en cuenta que quien compra debe ser mayor de edad.
>
> [Asegurar mi lugar]

**B13. ¿Cuándo me llega la boleta? / No me ha llegado la boleta.**
> La boleta llega al correo que registraste apenas se aprueba el pago, en un PDF adjunto. Revisa la carpeta de correo no deseado o promociones.
>
> Si pasaron más de 30 minutos y no llegó, escribe a hola@eventalist.co desde el correo con el que compraste, con el código de tu pedido, y te la reenvían.
>
> [Hablar con alguien] [Volver al menú]

**B14. Escribí mal mi correo al comprar.**
> Escribe a hola@eventalist.co con el código de tu pedido y los datos de la compra (nombre y medio de pago) para verificar que es tuya. El equipo corrige el correo y te reenvía la boleta.
>
> [Hablar con alguien]

**B15. ¿Necesito imprimir la boleta?**
> No. Puedes mostrarla en el celular: en la entrada escaneamos el código QR de cada boleta. Si prefieres imprimirla, también sirve.
>
> Te pueden pedir el documento de identidad para verificar el nombre.
>
> [Ver cómo llegar] [Volver al menú]

**B16. ¿Puedo pedir factura?**
> Sí. Eventalist S.A.S. emite la factura electrónica de venta. Si la necesitas a nombre de una empresa o con datos distintos de los del pedido, escribe a hola@eventalist.co al momento de la compra con el código del pedido y los datos de facturación.
>
> [Hablar con alguien]

**B17. ¿Hay boletas en la puerta?**
> La venta es en línea. Si al cierre de la venta quedan cupos, se podrán comprar en la entrada de la Hospedería Duruelo antes de cada franja, pero no está garantizado. Lo más seguro es comprar ahora.
>
> [Asegurar mi lugar]

*Nota: confirmar con los organizadores que sí habrá venta en puerta. Si no, quitar la segunda frase.*

**B18. ¿Hay que reservar asiento?**
> No. Las boletas no tienen asiento numerado: cada una da un lugar en la sala durante su franja. Conviene llegar unos minutos antes de cada inicio.
>
> [Asegurar mi lugar]

**B19. Quiero ir con un niño o un adolescente.**
> Los menores de edad pueden asistir con su propia boleta, acompañados por un adulto responsable. La compra debe hacerla un mayor de edad.
>
> Los conversatorios tratan la historia reciente del país, con temas como el conflicto armado y el narcotráfico; ten eso en cuenta según la edad.
>
> [Asegurar mi lugar]

### Bloque C · Agenda y panelistas

**C1. ¿Quiénes van? / ¿Quiénes estarán?**
> Daniel Samper Pizano, que creó la Unidad Investigativa de El Tiempo. Yolanda Ruiz y María Elvira Samper. Cecilia Orozco, que dirigió Noticias Uno trece años. León Valencia, Marta Ruiz, Luz María Sierra, Marisol Gómez, Martha Soto, Guillermo González Uribe, Ana María Echeverri y Darío Restrepo.
>
> Cada uno habla del hecho que cubrió. Una conversación que no se repite.
>
> [Asegurar mi lugar] [Quién habla de qué]

*"Quién habla de qué" abre C4. Los nombres van con una credencial y no en lista plana: la lista informa, la credencial antoja. En el sitio quedan los perfiles completos.*

**C2. ¿Va [nombre de un panelista confirmado]?**
> Sí. [Nombre] participa en "[título del conversatorio]", el [día] de [hora]. [Una línea de la ficha sobre esa persona.]
>
> Esa sesión está en la franja del [día, jornada].
>
> [Ver agenda] [Asegurar mi lugar]

*ManyChat: una respuesta por panelista con las palabras clave del nombre y apellido (incluir variantes sin tilde: "leon valencia", "maria elvira").*

**C3. ¿Va [nombre de alguien que NO está confirmado]?**
> La lista de panelistas confirmados está en el sitio y la vamos actualizando allí. Por ahora no tengo confirmado ese nombre.
>
> [Ver panelistas] [Volver al menú]

*Nunca decir "no va" ni "está por confirmar": solo lo que está publicado.*

**C4. ¿Cuál es la agenda? / ¿Qué temas se tratan?**
> Va en orden, como pasó. Viernes: el Bogotazo, la dictadura y el Frente Nacional, con Daniel Samper Pizano. Sábado: las guerrillas y los procesos de paz, con León Valencia y Marisol Gómez; en la tarde, narcotráfico, paramilitarismo y reelecciones, con Martha Soto y Cecilia Orozco.
>
> Domingo: los magnicidios y las víctimas, y las mujeres periodistas que cubrieron el conflicto, con Yolanda Ruiz y María Elvira Samper. Cincuenta años de Colombia en siete conversaciones, contados por quienes estaban ahí.
>
> [Asegurar mi lugar] [Ver agenda completa]

*Los temas se cuentan como relato cronológico, no como horario. Las horas exactas están en C5 y en el sitio. Las charlas abiertas del jueves y el viernes en la mañana se explican en C6.*

**C5. ¿A qué hora empieza y termina cada día?**
> Jueves 5: charlas abiertas a las 10:00 a.m. y a las 3:00 p.m. (Casa Museo).
> Viernes 6: charla abierta a las 10:00 a.m. (Casa Museo); conversatorios de 3:00 a 6:00 p.m. (Duruelo).
> Sábado 7: conversatorios de 9:00 a.m. a 12:30 p.m. y de 3:00 a 6:30 p.m.
> Domingo 8: conversatorios de 9:00 a.m. a 1:00 p.m.
>
> [Ver agenda] [Asegurar mi lugar]

**C6. ¿Qué hay el jueves 5? ¿Es gratis?**
> Sí, el jueves 5 es de entrada libre, en la Casa Museo Antonio Nariño: a las 10:00 a.m. una charla de reportería con Daniel Esteban Alvarado, de la Universidad de Boyacá, y a las 3:00 p.m. el documental "Sady González, una luz en la memoria", presentado por Guillermo González Uribe.
>
> No necesitas boleta. Los detalles de cupos e inscripción se publican en el sitio. Los conversatorios con los grandes nombres del periodismo empiezan el viernes en la tarde, con boleta.
>
> [Ver agenda] [Asegurar mi lugar]

**C7. ¿Las charlas abiertas requieren inscripción?**
> La entrada es libre, sujeta al aforo de la Casa Museo. Los detalles de cupos e inscripción se publican en el sitio.
>
> Si además quieres los conversatorios del fin de semana, esos sí van con boleta.
>
> [Ver agenda] [Asegurar mi lugar]

**C8. ¿Puedo hacer preguntas a los panelistas?**
> Sí. Los conversatorios son cercanos, sin tarima lejana, con espacio para preguntas y desacuerdos.
>
> [Asegurar mi lugar]

**C9. ¿Puedo grabar o transmitir las sesiones?**
> No está permitido grabar en audio o video ni transmitir en directo. Las fotos personales sin flash, sin interrumpir la sesión, sí están permitidas salvo que en la sala se indique lo contrario.
>
> [Volver al menú]

**C10. ¿La agenda puede cambiar?**
> La participación de cada panelista depende de su disponibilidad. Si hay un cambio de panelista, de horario dentro de la misma franja o de sede, se avisa en el sitio y al correo de tu pedido, y la boleta sigue siendo válida.
>
> [Ver agenda]

### Bloque D · Cambios, cesión y devoluciones

**D1. ¿Puedo devolver la boleta o pedir reembolso?**
> Las boletas no tienen cambios ni devoluciones. Si no puedes asistir, puedes cederla gratis a otra persona.
>
> [Cómo cedo mi boleta] [Volver al menú]

*No añadir excusas ni "escríbenos y vemos". Si insisten, derivar a hola@eventalist.co sin prometer nada.*

**D2. ¿Puedo cambiar de franja o pasar de franja a pase completo?**
> Las boletas no tienen cambios. Cada boleta vale para la franja que indica, y el pase completo para todas. Si quieres otra franja, la compras aparte.
>
> [Asegurar mi lugar]

**D3. ¿Puedo cederle la boleta a otra persona? / ¿Cómo la cedo?**
> Sí, a título gratuito. Desde el enlace de tu pedido (está en el correo de confirmación) puedes actualizar el nombre del asistente, hasta la fecha límite que indique la tienda.
>
> Después de esa fecha, escribe a hola@eventalist.co desde el correo de la compra, con el código del pedido y el nombre de la nueva persona.
>
> [Hablar con alguien] [Volver al menú]

**D4. ¿Puedo revender mi boleta?**
> No. La reventa con fines de lucro no está permitida y las boletas compradas por fuera de la tienda oficial no son válidas. Sí puedes cederla gratis a otra persona.
>
> [Cómo cedo mi boleta]

**D5. ¿Qué pasa si llego tarde o no puedo ir un día?**
> La boleta sigue siendo válida para su franja, pero la llegada tarde o la inasistencia no dan derecho a devolución. Si ya empezó una sesión, el ingreso puede esperar hasta una pausa para no interrumpirla.
>
> [Ver agenda]

**D6. ¿Qué pasa si se cancela o se cambia la fecha?**
> Si el encuentro o una franja se aplaza o cambia de sede, tu boleta sigue vigente para la nueva fecha o sede. Si se cancela, se informa en el sitio y al correo de tu pedido junto con el procedimiento para las boletas afectadas.
>
> [Ver términos] [Volver al menú]

**D7. Perdí la boleta / me la borraron del correo.**
> Puedes volver a descargarla desde el enlace del pedido, que está en el correo de confirmación. Si no lo encuentras, escribe a hola@eventalist.co desde el correo de la compra con el código del pedido.
>
> No compartas la imagen ni el código de tu boleta: el QR se valida una sola vez por franja.
>
> [Hablar con alguien]

### Bloque E · Llegar, dormir, moverse

**E1. ¿Dónde es? / ¿Cuáles son las sedes?**
> En Villa de Leyva, Boyacá.
>
> · Conversatorios (con boleta): Hospedería Duruelo, carrera 3 n.º 12-88, en lo alto del pueblo.
> · Charlas abiertas (entrada libre): Casa Museo Antonio Nariño, carrera 9 n.º 10-25, a pocas cuadras de la plaza.
>
> [Ver en el mapa] [Asegurar mi lugar]

*"Ver en el mapa" lleva a `https://testigosdelamemoria.com/#lugar`, o directo a Google Maps: Duruelo `https://www.google.com/maps/search/?api=1&query=Hospeder%C3%ADa+Duruelo+Villa+de+Leyva`; Casa Museo `https://www.google.com/maps/search/?api=1&query=Casa+Museo+Antonio+Nari%C3%B1o+Villa+de+Leyva`.*

**E2. ¿Cómo llego a Villa de Leyva desde Bogotá?**
> Por carretera son entre 3 y 4 horas, saliendo por la Autopista Norte hacia Tunja. También hay buses directos y frecuentes desde la Terminal Salitre. Desde Tunja, el trayecto toma unos 45 minutos.
>
> El encuentro está pensado para ir y volver en el fin de semana: los conversatorios empiezan el viernes a las 3:00 p.m. y terminan el domingo a la 1:00 p.m.
>
> [Ver cómo llegar] [Asegurar mi lugar]

**E3. ¿Cómo llego desde Tunja, Medellín, Bucaramanga u otra ciudad?**
> Desde Tunja son unos 45 minutos por carretera, con buses frecuentes. Desde otras ciudades, lo habitual es llegar a Bogotá o a Tunja y desde ahí seguir por tierra.
>
> No hay aeropuerto comercial en Villa de Leyva.
>
> [Ver cómo llegar]

**E4. ¿Dónde me hospedo?**
> Villa de Leyva tiene una oferta amplia de hoteles y hospederías a pocas cuadras de las dos sedes. Las sesiones terminan al final de la tarde y la conversación sigue en el pueblo, así que vale la pena quedarse las dos noches.
>
> El encuentro cae en fin de semana: conviene reservar pronto. La boleta no incluye alojamiento. La Hospedería Duruelo, sede de los conversatorios, es también hotel; puedes consultar disponibilidad directamente con ellos.
>
> [Ver lugar] [Asegurar mi lugar]

*El bot no recomienda hoteles concretos ni da precios de alojamiento. Si los organizadores consiguen tarifas con hoteles aliados, se añaden aquí.*

**E5. ¿Las dos sedes quedan cerca? ¿Cómo me muevo dentro del pueblo?**
> Sí. Villa de Leyva se recorre a pie: la Casa Museo está a pocas cuadras de la plaza y la Hospedería Duruelo, en lo alto del pueblo, a unos minutos caminando cuesta arriba. Hay taxis y mototaxis en la plaza si prefieres no subir a pie.
>
> [Ver en el mapa]

**E6. ¿Hay parqueadero?**
> La Hospedería Duruelo tiene parqueadero para sus huéspedes; la disponibilidad para asistentes depende del hotel. En el pueblo hay parqueaderos públicos cerca de la plaza.
>
> [Ver en el mapa]

*Confirmar con Duruelo si el parqueadero estará disponible para asistentes. Si no, decir solo lo de los parqueaderos públicos.*

**E7. ¿La boleta incluye comida? ¿Hay almuerzo?**
> No, la boleta cubre solo el acceso a los conversatorios. Entre la franja de la mañana y la de la tarde hay tiempo para almorzar; Villa de Leyva tiene restaurantes a pocos minutos de la sede.
>
> [Ver agenda]

**E8. ¿Qué ropa llevo? ¿Qué clima hace?**
> Villa de Leyva está a unos 2.100 metros: días templados y soleados, mañanas y noches frescas. Lleva algo de abrigo para la mañana y la noche, y calzado cómodo para el empedrado.
>
> [Volver al menú]

**E9. ¿La sede es accesible para personas con movilidad reducida?**
> Si necesitas apoyo de accesibilidad, escríbenos antes a hola@eventalist.co y coordinamos con la sede para recibirte bien.
>
> [Hablar con alguien]

*Confirmar con Duruelo las condiciones de acceso (rampas, ascensor) antes de dar una respuesta más concreta.*

**E10. ¿Puedo ir con mascota?**
> Las sedes son un hotel y un museo, y las sesiones se realizan en salas cerradas. Te recomendamos no llevar mascotas a las sesiones.
>
> [Volver al menú]

### Bloque F · Prensa, alianzas, datos y otros

**F1. Soy periodista o medio, ¿puedo cubrir el encuentro?**
> Con gusto. Escribe a hola@eventalist.co con tu nombre, el medio y qué te interesa cubrir, y el equipo te responde sobre acreditación de prensa.
>
> [Hablar con alguien]

**F2. Quiero ser patrocinador o aliado.**
> Gracias por el interés. Escribe a hola@eventalist.co con el nombre de tu empresa o institución y el equipo organizador te contacta.
>
> [Hablar con alguien]

**F3. ¿Cómo tratan mis datos? / ¿Van a enviarme publicidad?**
> Los datos de tu compra los trata Eventalist S.A.S. solo para emitir tu boleta, gestionar el pedido y controlar el ingreso. No se comparten ni se venden a terceros, y no se usan para publicidad salvo que lo autorices aparte.
>
> La política completa está en https://testigosdelamemoria.com/tratamiento-de-datos/ y cualquier consulta va a hola@eventalist.co.
>
> [Volver al menú]

**F4. ¿Van a tomar fotos o video del público?**
> Sí. Durante el encuentro se toman fotos y se graban las sesiones para documentarlo y comunicarlo en el sitio, redes y medios, y esas imágenes pueden incluir al público. Está explicado en los términos de compra.
>
> [Ver términos]

**F5. ¿Tienen redes? ¿Dónde sigo las novedades?**
> En Instagram: @testigosdelamemoria. Y en el sitio, donde se publican la agenda y cualquier cambio: https://testigosdelamemoria.com
>
> [Volver al menú]

**F6. ¿Hay certificado de asistencia?**
> No se entrega certificado de asistencia.
>
> [Volver al menú]

*Cambiar si los organizadores deciden emitirlo.*

**F7. ¿Habrá venta de libros o firma de libros?**
> Por ahora no está confirmado. Cualquier actividad adicional se anuncia en el sitio y en Instagram.
>
> [Volver al menú]

**F8. Tengo una queja o reclamo sobre mi compra.**
> El canal de atención de Eventalist para compras, boletas y reclamos es hola@eventalist.co. Escribe desde el correo con el que compraste e indica el código del pedido; te responden por el mismo hilo dentro de los 15 días hábiles.
>
> [Hablar con alguien]

**F9. Mensaje fuera de tema o que el bot no entiende.**
> No estoy seguro de haber entendido. Puedo ayudarte con estas cosas:
>
> [Sobre el encuentro] [Boletas y precios] [Agenda y panelistas] [Llegar y dormir] [Hablar con alguien]

*Son las respuestas rápidas del menú de temas (sección 3), no botones: en Instagram caben hasta trece.*

---

## 5. Nodo disparador principal: palabras clave

El disparador principal de ManyChat abre el flujo del bot cuando un mensaje contiene alguna de estas palabras. La meta es una sola: que nadie que escriba con intención de comprar, o con una duda que frena la compra, se quede sin respuesta. Por eso la lista es amplia y cubre cómo escribe la gente de verdad: sin tildes, con abreviaturas, con errores, en mayúsculas, con emojis y en inglés.

### Cómo configurarlo

- Condición **"el mensaje contiene"** (no "es igual a"). ManyChat no distingue mayúsculas, pero sí tildes: cada palabra con tilde va dos veces, con y sin.
- Una palabra corta puede disparar por accidente dentro de otra ("ir" dentro de "decir"). Las de dos o tres letras van con espacio delante o se omiten.
- El mismo disparador se usa en tres lugares: **mensajes directos**, **respuestas a historias** y **comentarios en publicaciones** (con respuesta pública corta y el detalle por DM).
- Además del disparador principal, cada bloque de la sección 4 tiene su propio disparador con las palabras de la tabla de ruteo (más abajo). El principal atrapa lo que se escape y muestra el menú.

### Lista maestra (pegar en el disparador principal)

**Intención de compra** (lo más importante: aquí está la venta)

```
boleta, boletas, boleto, boletos, entrada, entradas, ticket, tickets, tiquete, tiquetes, pase, pases, pase completo, comprar, compra, compro, quiero comprar, quiero ir, quiero asistir, quiero mi boleta, como compro, cómo compro, donde compro, dónde compro, donde las compro, como adquiero, adquirir, reservar, reserva, apartar, aparta, separar, separame, sepárame, cupo, cupos, aforo, disponible, disponibles, disponibilidad, quedan, todavia hay, todavía hay, aun hay, aún hay, hay boletas, se agotaron, agotado, agotadas, link, enlace, pagina, página, web, sitio, tienda, checkout, carrito, inscribirme, inscripcion, inscripción, registro, registrarme, asistir, ir al evento, me apunto, cuenten conmigo, ahi estare, ahí estaré, info, informacion, información, mas info, más info, me interesa, interesado, interesada, quiero saber
```

**Precio y pago**

```
precio, precios, cuanto, cuánto, cuanto cuesta, cuánto cuesta, cuanto vale, cuánto vale, valor, costo, cuesta, vale, tarifa, tarifas, plata, pesos, cop, $, barato, caro, descuento, descuentos, promo, promocion, promoción, oferta, rebaja, cupon, cupón, codigo, código, estudiante, estudiantes, tercera edad, adulto mayor, pensionado, grupo, grupos, pagar, pago, pagos, medios de pago, forma de pago, tarjeta, credito, crédito, debito, débito, pse, nequi, daviplata, bancolombia, transferencia, consignacion, consignación, efectivo, cuotas, wompi, factura, facturacion, facturación, seguro, es seguro, confiable, real, estafa, legitimo, legítimo
```

**Etapas y fechas de venta**

```
hasta cuando, hasta cuándo, fecha limite, fecha límite, plazo, etapa, etapas, etapa 1, etapa 2, preventa, cuando abren, cuándo abren, cuando salen, cuándo salen, ya estan, ya están, ya salieron, franja, franjas, por franja, un solo dia, un solo día, medio dia, medio día, solo el sabado, solo el sábado, solo el domingo, solo el viernes, avisame, avísame, avisenme, avísenme, aviso, notificar, lista de espera
```

**El evento**

```
testigos, testigos de la memoria, memoria, periodistas en la historia, encuentro, evento, festival, conversatorio, conversatorios, charla, charlas, charlas abiertas, taller, talleres, que es, qué es, de que se trata, de qué se trata, de que trata, como es, cómo es, que hay, qué hay, programa, programacion, programación, agenda, cronograma, horario, horarios, hora, a que hora, a qué hora, cuando es, cuándo es, fecha, fechas, dia, día, dias, días, noviembre, 5 de noviembre, 6 de noviembre, 7 de noviembre, 8 de noviembre, jueves, viernes, sabado, sábado, domingo, primera edicion, primera edición, organiza, organizan, organizador, organizadores, cordovez, restrepo, zaquencipa, eventalist
```

**Nombres (cada uno abre la respuesta C2 del panelista)**

```
periodista, periodistas, panelista, panelistas, invitado, invitados, quienes, quiénes, quien va, quién va, quienes van, quiénes van, quien viene, quién viene, van a estar, estara, estará, confirmados, samper, daniel samper, samper pizano, los danieles, yolanda, yolanda ruiz, maria elvira, maría elvira, elvira samper, menopausicas, menopáusicas, cecilia, cecilia orozco, orozco, leon valencia, león valencia, valencia, pares, dario restrepo, darío restrepo, luz maria sierra, luz maría sierra, el colombiano, marta ruiz, martha ruiz, comision de la verdad, comisión de la verdad, marisol, marisol gomez, marisol gómez, martha soto, soto, unidad investigativa, guillermo gonzalez, guillermo gonzález, gonzalez uribe, gonzález uribe, sady, sady gonzalez, sady gonzález, ana maria echeverri, ana maría echeverri, echeverri, yo soy yo
```

**Temas (antojan y llevan a la agenda)**

```
bogotazo, gaitan, gaitán, 9 de abril, dictadura, rojas pinilla, frente nacional, guerrilla, guerrillas, farc, eln, m-19, m19, paz, proceso de paz, negociacion, negociación, caguan, caguán, la habana, narcotrafico, narcotráfico, narcos, escobar, pablo escobar, cartel, carteles, paramilitar, paramilitares, paramilitarismo, parapolitica, parapolítica, autodefensas, reeleccion, reelección, reelecciones, uribe, magnicidio, magnicidios, galan, galán, pizarro, jaramillo, lara bonilla, victimas, víctimas, violencia, conflicto, conflicto armado, mujeres periodistas, historia, historia de colombia, historia reciente, cincuenta años, 50 años, memoria historica, memoria histórica, documental, reporteria, reportería, periodismo digital, periodismo
```

**Lugar y logística**

```
donde, dónde, donde es, dónde es, donde queda, dónde queda, lugar, sede, sedes, direccion, dirección, ubicacion, ubicación, mapa, villa de leyva, villa de leiva, leyva, leiva, boyaca, boyacá, tunja, duruelo, hospederia, hospedería, casa museo, museo, nariño, narino, antonio nariño, como llego, cómo llego, como llegar, cómo llegar, llegar, transporte, bus, buses, flota, terminal, carretera, viaje, desde bogota, desde bogotá, desde medellin, desde medellín, desde bucaramanga, desde cali, hotel, hoteles, hospedaje, alojamiento, hostal, airbnb, donde dormir, dónde dormir, donde me quedo, dónde me quedo, quedarme, parqueadero, parquear, carro, comida, almuerzo, restaurante, refrigerio, incluye, clima, frio, frío, ropa, accesibilidad, silla de ruedas, discapacidad, mascota, perro, niños, niño, niña, hijos, menores, edad, virtual, online, en linea, en línea, streaming, en vivo, transmision, transmisión, grabacion, grabación, grabar, zoom, remoto
```

**Después de comprar (van a soporte, pero también son ventas que se pueden perder)**

```
no me llego, no me llegó, no llego, no llegó, no recibi, no recibí, no he recibido, correo, email, mail, spam, reenviar, reenvio, reenvío, reenvien, reenvíen, perdi, perdí, borre, borré, descargar, pdf, qr, codigo qr, código qr, imprimir, impresa, celular, cambiar, cambio, cambiar nombre, ceder, cesion, cesión, transferir, regalar, regalo, otra persona, revender, reventa, devolucion, devolución, devolver, reembolso, reembolsar, cancelar, cancelacion, cancelación, cancelaron, aplazaron, aplazamiento, pedido, orden, numero de pedido, número de pedido, confirmacion, confirmación, asiento, silla, puesto, numerado, llego tarde, llegar tarde, certificado, constancia
```

**Prensa, alianzas, datos**

```
prensa, medio, medios, cubrir, cubrimiento, acreditacion, acreditación, entrevista, patrocinio, patrocinar, patrocinador, aliado, aliados, alianza, marca, apoyo, datos, datos personales, privacidad, politica, política, publicidad, fotos, foto, video, imagen, instagram, redes, seguir, queja, reclamo, problema, ayuda, soporte, humano, persona, asesor, alguien, hablar con alguien, atencion, atención
```

**Saludos y arranques (abren el menú)**

```
hola, holaa, holaaa, buenas, buenos dias, buenos días, buenas tardes, buenas noches, hey, ey, que tal, qué tal, saludos, disculpa, disculpe, una pregunta, pregunta, tengo una duda, duda, dudas, consulta, me pueden, me puedes, por favor, porfa, porfavor, gracias, hello, hi, hey there, tickets, price, how much, where, when, english
```

**Emojis que la gente manda solos** (Instagram): 🎟️ 🎫 🙋 🙋‍♀️ 🙋‍♂️ ❤️ 🔥 👏 ✋ 📍 📅 💸 💳 ❓ ⁉️ 👀 🤔 → abren el menú de bienvenida.

### Palabras clave para comentarios en publicaciones (Instagram)

Cuando la gente comenta en un post, ManyChat responde en público con una frase corta y manda el detalle por DM. Palabras para ese disparador:

```
info, información, informacion, precio, precios, boleta, boletas, entrada, entradas, link, enlace, quiero, me interesa, cómo compro, como compro, dónde compro, donde compro, cuánto, cuanto, cuando, cuándo, dónde, donde, más información, mas informacion, interesado, interesada, yo, yo quiero, cuenten conmigo, ahí estaré, ahi estare, agenda, quiénes van, quienes van
```

Respuesta pública (comentario):
> Te escribimos por mensaje directo con toda la información.

Mensaje por DM: la respuesta que corresponde a la palabra del comentario, no la bienvenida. La persona viene de un post concreto y el DM continúa ese post; reiniciar con un menú la enfría.

| Palabra del comentario | DM que recibe |
|---|---|
| BOLETAS, precio, cuánto, link, cómo compro, quiero, me interesa, yo, cuenten conmigo | B1, con el botón de compra |
| AGENDA, temas, cuándo, quiénes van | C4 |
| Apellido de un panelista (SAMPER, OROZCO, VALENCIA...) | La C2 de ese panelista |
| info, información, dónde y cualquier otra | Bienvenida de la sección 3 |

Llamado en las publicaciones para provocar el comentario: "Comenta BOLETAS y te escribimos por mensaje" (una sola palabra, en mayúsculas, fácil de escribir). Alternar según el post: **BOLETAS** para publicaciones de venta, **AGENDA** para publicaciones de temas y el nombre del panelista (por ejemplo **SAMPER**) para las publicaciones de cada periodista.

### Ruteo por intención (disparadores de cada bloque)

Para el campo libre de ManyChat (Instagram y WhatsApp). Cada fila dispara la respuesta indicada. Incluir versiones sin tilde y con errores comunes.

| Palabras clave | Respuesta |
|---|---|
| precio, cuánto cuesta, cuanto vale, valor, boleta, boletas, entrada, ticket | B1 |
| pase completo, pase, todo el evento | B2 |
| franja, franjas, un solo día, medio día, solo el sábado, solo el domingo | B3 |
| no puedo comprar, no me deja, no disponible, aún no disponible, cuándo abren | B4 |
| hasta cuándo, fecha límite, plazo | B5 |
| descuento, estudiante, tercera edad, adulto mayor, grupo, promoción, cupón, código | B6 |
| cómo compro, comprar, dónde compro, link, enlace | B7 |
| pagar, pago, tarjeta, pse, nequi, daviplata, bancolombia, efectivo, transferencia | B8 / B10 |
| seguro, confiable, estafa, es real | B9 |
| exterior, otro país, internacional, dólares | B11 |
| varias, para otra persona, regalo, regalar | B12 |
| no llegó, no me llegó, no recibí, correo, spam | B13 |
| correo mal, equivocado, error en el correo | B14 |
| imprimir, impresa, celular, qr | B15 |
| factura, facturación, empresa, nit | B16 |
| taquilla, puerta, en la entrada, el mismo día | B17 |
| asiento, silla, puesto, numerado | B18 |
| niño, niña, hijo, menor, adolescente, edad | B19 |
| quiénes, quien va, panelistas, invitados, periodistas | C1 |
| samper, yolanda, cecilia orozco, león valencia, leon valencia, restrepo, luz maría sierra, marta ruiz, marisol, martha soto, guillermo gonzález, echeverri | C2 (una por nombre) |
| agenda, programación, programa, temas, horario, hora | C4 / C5 |
| jueves, gratis, gratuito, entrada libre, charlas abiertas, documental, sady | C6 |
| inscripción, inscribirme, registro | C7 |
| preguntas, preguntar, participar | C8 |
| grabar, transmisión, en vivo, streaming, virtual, online, zoom | A8 / C9 |
| devolución, devolver, reembolso, reembolsar, plata, dinero | D1 |
| cambiar, cambio de franja, cambio | D2 |
| ceder, cesión, transferir, otra persona, cambiar el nombre | D3 |
| revender, reventa, vendo mi boleta | D4 |
| llego tarde, tarde, no puedo ir | D5 |
| cancela, cancelan, aplazan, aplazamiento | D6 |
| perdí, borré, descargar de nuevo, reenviar | D7 |
| dónde es, sede, lugar, dirección, duruelo, casa museo, nariño, mapa | E1 |
| cómo llego, llegar, bogotá, carretera, bus, terminal, transporte | E2 / E3 |
| hotel, hospedaje, dormir, alojamiento, dónde me quedo, airbnb | E4 |
| caminar, distancia, cerca, taxi | E5 |
| parqueadero, parquear, carro | E6 |
| comida, almuerzo, refrigerio, incluye | E7 |
| clima, frío, ropa, qué llevo | E8 |
| silla de ruedas, accesibilidad, discapacidad, movilidad | E9 |
| mascota, perro | E10 |
| prensa, periodista, cubrir, acreditación | F1 |
| patrocinio, patrocinador, aliado, marca | F2 |
| datos, privacidad, política, publicidad | F3 |
| fotos, video, imagen | F4 |
| instagram, redes, seguir | F5 |
| certificado, constancia | F6 |
| libros, firma | F7 |
| queja, reclamo, problema, mal servicio | F8 |
| humano, persona, asesor, hablar con alguien | Derivación a humano |

---

## 6. Captura de datos en el bot (si se usa)

Si el bot guarda nombre, correo o teléfono para avisar cuando abran las franjas o para novedades del encuentro, la ley colombiana (Ley 1581 de 2012 y Ley 2300 de 2023) exige autorización previa, expresa e informada. Texto para la casilla o el botón de aceptación, igual al del sitio:

> Soy mayor de edad y autorizo a Eventalist a tratar mis datos para enviarme información del encuentro y de otros eventos por correo electrónico y WhatsApp, según la política de tratamiento de datos: https://testigosdelamemoria.com/tratamiento-de-datos/
>
> [Autorizo] [No, gracias]

Reglas:

- Sin "Autorizo", no se guarda nada ni se etiqueta para envíos.
- Los datos no se comparten ni se venden a terceros.
- Cualquier mensaje promocional posterior debe permitir salir: "Responde SALIR para no recibir más mensajes".
- Consultas, correcciones o retiro de la autorización: hola@eventalist.co.

---

## 7. Mantenimiento

Fechas en las que hay que actualizar el bot:

| Cuándo | Qué cambia |
|---|---|
| 5 de octubre de 2026 | Abre la etapa 2. B1, B3, B4 y B5 pasan a: "El pase completo ya no está a la venta. Hay boletas por franja a 90.000 COP cada una". La segunda burbuja de la bienvenida pasa a: "Boletas por media jornada desde 90.000 COP. Cada franja tiene aforo limitado". El botón "Avísame cuando abran" desaparece y a los etiquetados `aviso-etapa-2` se les escribe ese día. |
| Si el pase completo se agota antes del 4 de octubre | B1 y B2: "El pase completo se agotó. Las boletas por franja abren el 5 de octubre". |
| Si una franja se agota | La respuesta de esa franja dice "agotada" y ofrece las que quedan. |
| Cada vez que cambie la agenda o entre un panelista | Ficha (sección 1), C1, C2, C4, C5 y la descripción de la franja afectada. |
| Cuando se publiquen cupos o inscripción de las charlas abiertas | C6 y C7. |
| Cuando se confirmen parqueadero, venta en puerta, accesibilidad, tarifas de grupo | B6, B17, E6, E9. |
| 1 de noviembre de 2026 | Añadir al menú un botón "Ya tengo boleta: qué necesito saber" con B15, E1, E5 y D7. |
| Del 5 al 8 de noviembre | Bienvenida en tiempo real: "El encuentro está en curso. Hoy: [sesiones del día]". |
| 9 de noviembre de 2026 | Modo cierre: "El encuentro terminó. Gracias por acompañarnos. Síguenos en @testigosdelamemoria para la próxima edición". Sin botón de compra. |

Antes de publicar cualquier cambio: leer la respuesta en un celular, comprobar que cada burbuja cabe en cuatro líneas, que no hay más de tres botones por mensaje ni botones de más de 20 caracteres, que el botón de compra dice "Asegurar mi lugar", que no hay guiones largos ni mayúsculas gritadas y que todos los enlaces abren.
