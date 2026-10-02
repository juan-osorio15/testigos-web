# Atención por WhatsApp e Instagram · Pendientes y notas internas

Notas internas del chatbot de Testigos de la Memoria. Versión del 1 de octubre de 2026. **Este archivo no se sube al chatbot.**

Dónde está cada cosa:

- `docs/chatbot-conocimiento.md`: la base de conocimiento (ficha del evento, preguntas con respuesta y lo que no se dice). Es lo que se sube a la plataforma.
- `docs/system-prompt-atencion.md`: el system prompt y los ajustes.
- Este archivo: las preguntas que el sitio todavía no responde, las inconsistencias encontradas y las fechas en que cambian las respuestas.

El sitio es la fuente de verdad. Cuando una pregunta de aquí se responda, se publica en el sitio (si aplica), se pasa a `docs/chatbot-conocimiento.md` y se quita de esta lista.

---

## 1. Preguntas a responder

Preguntas que la gente va a hacer y que el sitio no responde. Mientras no tengan respuesta, quien atiende dice que no lo tiene confirmado y deriva a hola@eventalist.co o a una persona del equipo, sin inventar. Cuando se responda una, se publica primero en el sitio (si aplica) y luego se pasa a `docs/chatbot-conocimiento.md` y se vuelve a subir al chatbot.

### Prioridad alta (preguntas de compra que llegan ya)

1. **¿Qué pasa con el pase completo desde el 13 de octubre? ¿Sigue a la venta y a qué precio?**
   - Por qué importa: no está definido. Por ahora el sitio y el chatbot solo dicen que el mayor descuento es el de la etapa 1, sin decir si el pase sigue ni si se retira.
   - Decide: organizadores.

2. **¿Qué medios de pago concretos acepta la tienda? ¿PSE, Nequi, Daviplata, tarjetas internacionales?**
   - Por qué importa: el sitio dice "todos los medios de pago" de Wompi. La gente pregunta por su medio puntual.
   - Decide: eventalist (configuración de Wompi).

3. **¿Se puede comprar desde el exterior?**
   - Por qué importa: colombianos fuera del país y extranjeros.
   - Decide: eventalist (Wompi).

4. **¿Hay descuento para estudiantes, adultos mayores, periodistas, docentes o grupos?**
   - Por qué importa: pregunta muy frecuente en eventos culturales.
   - Decide: organizadores.

5. **¿Venden boletas para colegios, universidades o empresas en bloque? ¿Con quién se habla?**
   - Por qué importa: ventas grandes que hoy no tienen camino.
   - Decide: organizadores.

6. **¿Cuánto tarda en llegar la boleta tras el pago? ¿Qué pasa si el pago queda pendiente?**
   - Por qué importa: el sitio solo dice "aprobado el pago". La guía anterior decía "30 minutos" sin fuente.
   - Decide: eventalist.

7. **¿Hasta qué fecha se puede ceder la boleta desde el enlace del pedido?**
   - Por qué importa: los términos remiten a "la fecha límite que indique la tienda".
   - Decide: eventalist.

8. **¿El pase completo puede usarlo una persona distinta cada día?**
   - Por qué importa: el pase es una sola boleta nominativa; no está claro si se puede ceder por días.
   - Decide: organizadores y Eventalist.

9. **¿Habrá venta en la puerta si quedan cupos?**
   - Por qué importa: la guía anterior lo insinuaba sin confirmación.
   - Decide: organizadores.

10. **¿Los menores pagan boleta completa? ¿Hay edad mínima recomendada?**
   - Por qué importa: términos: menores con su propia boleta; no hay precio ni edad mínima.
   - Decide: organizadores.

### Charlas abiertas

11. **¿Hay que inscribirse a las charlas abiertas? ¿Cuántos cupos hay?**
   - Por qué importa: el sitio dice "los detalles se publicarán en esta página". Queda un mes.
   - Decide: organizadores.

12. **¿Cuánto dura el documental de Sady González y la charla de periodismo digital?**
   - Por qué importa: solo tienen hora de inicio.
   - Decide: organizadores.

13. **¿Hay conversatorio con preguntas después del documental?**
   - Por qué importa: para quien viene solo el jueves.
   - Decide: organizadores.

### Accesibilidad y bienestar

14. **¿La sala de Duruelo es accesible en silla de ruedas? ¿Hay rampas, ascensor, baño accesible?**
   - Por qué importa: duruelo queda "en lo alto del pueblo" y el casco histórico es empedrado. Público de 35 a 70 años.
   - Decide: duruelo y organizadores.

15. **¿La Casa Museo Antonio Nariño es accesible?**
   - Por qué importa: casona colonial del siglo XVII, monumento nacional.
   - Decide: casa Museo.

16. **¿Hay forma de llegar en vehículo hasta la puerta de Duruelo para quien no puede subir a pie? ¿Hay transporte entre sedes?**
   - Por qué importa: movilidad reducida y adultos mayores.
   - Decide: organizadores y Duruelo.

17. **¿Se reservan lugares para personas con movilidad reducida, adultos mayores o con discapacidad?**
   - Por qué importa: sin asiento numerado: el primero que llega escoge.
   - Decide: organizadores.

18. **¿El acompañante o cuidador de una persona con discapacidad paga boleta?**
   - Por qué importa: pregunta habitual; tiene implicaciones legales.
   - Decide: organizadores y Eventalist (consultar al abogado).

19. **¿Habrá intérprete de lengua de señas, subtítulos o apoyo auditivo (bucle magnético, amplificación)?**
   - Por qué importa: personas sordas o con baja audición.
   - Decide: organizadores.

20. **¿Se puede entrar con perro de asistencia? ¿Y con mascotas?**
   - Por qué importa: la guía anterior recomendaba no llevar mascotas, sin fuente.
   - Decide: organizadores y sedes.

21. **¿Hay atención de primeros auxilios o enfermería en la sede?**
   - Por qué importa: villa de Leyva está a unos 2.100 metros; público mayor.
   - Decide: organizadores.

22. **¿Las sillas son cómodas para sesiones de dos horas y media? ¿Hay pausas?**
   - Por qué importa: el viernes es un bloque de 3:00 a 6:00 p.m..
   - Decide: organizadores.

### Logística del día

23. **¿A qué hora abren las puertas antes de cada franja?**
   - Por qué importa: "Llegar antes" no dice cuánto.
   - Decide: organizadores.

24. **¿Duruelo tendrá parqueadero para asistentes? ¿Con costo?**
   - Por qué importa: mucha gente llega en carro desde Bogotá.
   - Decide: duruelo.

25. **¿Hay café, agua o refrigerio durante las sesiones? ¿Se puede entrar con bebidas?**
   - Por qué importa: sesiones largas.
   - Decide: organizadores y Duruelo.

26. **¿Dónde almorzar el sábado entre 12:30 y 3:00 p.m.? ¿Duruelo tiene restaurante abierto a asistentes?**
   - Por qué importa: pausa larga del sábado.
   - Decide: duruelo.

27. **¿Hay wifi y enchufes en la sala?**
   - Por qué importa: quien toma notas en portátil o tableta.
   - Decide: duruelo.

28. **¿Hay guardarropa o dónde dejar maletas el domingo después de salir del hotel?**
   - Por qué importa: el domingo termina a la 1:00 p.m. y la gente viaja.
   - Decide: organizadores y Duruelo.

29. **Si llueve, ¿cambia algo? ¿Las salas son cerradas?**
   - Por qué importa: noviembre es temporada de lluvias.
   - Decide: organizadores.

30. **¿Hay código de vestuario?**
   - Por qué importa: pregunta típica en eventos de este nivel; el sitio no lo menciona.
   - Decide: organizadores.

31. **¿Cuál es el aforo de cada sala?**
   - Por qué importa: el sitio dice "aforo limitado" sin cifra. Decidir si se publica.
   - Decide: organizadores.

### Contenido y formato

32. **¿Se transmite en vivo? ¿Habrá versión virtual o grabaciones para ver después?**
   - Por qué importa: el sitio no lo dice. La guía anterior respondía "no" sin fuente.
   - Decide: organizadores.

33. **¿En qué idioma son las sesiones? ¿Hay traducción para extranjeros?**
   - Por qué importa: el sitio tiene versión en inglés, lo que invita a preguntar.
   - Decide: organizadores.

34. **¿Dan certificado o constancia de asistencia?**
   - Por qué importa: estudiantes y docentes lo piden. La guía anterior decía "no" sin fuente.
   - Decide: organizadores.

35. **¿Habrá venta y firma de libros de los panelistas?**
   - Por qué importa: relato, Librería y Centro Cultural es aliado; varios panelistas tienen libros.
   - Decide: organizadores y Relato.

36. **¿Puedo tomarme una foto o hablar con los panelistas después?**
   - Por qué importa: muy probable con nombres como Daniel Samper Pizano o Yolanda Ruiz.
   - Decide: organizadores.

37. **¿Habrá actividades adicionales (recorridos, cenas, encuentros con panelistas)?**
   - Por qué importa: hay un cóctel que no es público; la respuesta debe ser coherente con eso.
   - Decide: organizadores.

38. **¿Cómo se manejan las preguntas del público (micrófono, tarjetas, tiempo)?**
   - Por qué importa: el sitio promete preguntas y desacuerdos.
   - Decide: organizadores.

39. **¿Habrá una segunda edición?**
   - Por qué importa: pregunta frecuente al final; afecta el mensaje de cierre.
   - Decide: organizadores.

### Prensa, alianzas y otros

40. **Soy periodista o medio, ¿cómo me acredito? ¿Hasta cuándo?**
   - Por qué importa: ya existen escarapelas de prensa, pero el proceso no está publicado.
   - Decide: organizadores.

41. **Quiero ser patrocinador o aliado, ¿con quién hablo?**
   - Por qué importa: hoy solo existe hola@eventalist.co, que es canal de compras.
   - Decide: organizadores.

42. **¿Puedo ser voluntario o ayudar en la logística?**
   - Por qué importa: estudiantes de comunicación de la región.
   - Decide: organizadores.

43. **¿Hay un teléfono o WhatsApp de atención el día del evento?**
   - Por qué importa: por política, el sitio solo publica el correo.
   - Decide: organizadores y Eventalist.

44. **¿Qué se responde si preguntan por el cóctel de bienvenida?**
   - Por qué importa: no se anuncia, pero alguien lo va a mencionar.
   - Decide: organizadores.

45. **¿Hay alojamiento más económico que los dos aliados (hostales, Airbnb)?**
   - Por qué importa: los aliados son de gama media-alta.
   - Decide: organizadores (decidir si se recomienda algo más o solo se orienta).

46. **¿Cómo llego desde Medellín, Bucaramanga u otras ciudades? ¿Aeropuerto más cercano?**
   - Por qué importa: el sitio solo cubre Bogotá y Tunja.
   - Decide: equipo (se puede responder con información pública, sin garantizar).

47. **¿Qué clima hace en noviembre? ¿Qué ropa llevo?**
   - Por qué importa: fácil de responder con información general, pero no está en el sitio.
   - Decide: equipo (decidir si se permite).

---

## 2. Inconsistencias encontradas

- **`docs/chatbot-manychat.md`** (16 de septiembre) ya no sirve como fuente:
  - Lista doce panelistas: faltan Fidel Cano y Jorge Cardona, que entraron el 25 de septiembre.
  - Presenta a Luz María Sierra como "directora de El Colombiano"; el sitio dice "exdirectora".
  - Dice que el bot no recomienda hoteles; el sitio ya tiene dos aliados con oferta.
  - Da como hechos varias respuestas que el sitio no respalda: transmisión, idioma, certificado, mascotas, clima, parqueadero, plazo de llegada de la boleta, compra internacional y la lista de medios de pago. Todas quedaron en la sección 1.
- **`docs/pretix-tienda-textos.md`** llama "talleres de periodismo" a las charlas abiertas en un texto de la tienda; el sitio dice "charlas abiertas".
- **Preguntas frecuentes del sitio**: dicen "Los detalles de cupos e inscripción se publicarán en esta página" (charlas abiertas). A un mes del evento, conviene resolverlo (pregunta 11).
- **Etapa 2**: el sitio no dice qué pasa con el pase desde el 13 de octubre, a propósito (2026-10-01). Cuando se decida, hay que cambiar a la vez la tienda, el `price` del pase en `src/data/event.ts`, los textos del calendario de venta (`src/ui.ts`) y el bloque "Estado de la venta" del system prompt.

---

## 3. Fechas en que cambian las respuestas

- **Lunes 12 de octubre:** último día del precio de la etapa 1 del pase completo.
- **Martes 13 de octubre:** abren las boletas de medio día (90.000 COP). Lo del pase depende de la pregunta 1.
- **Si se agota una boleta:** se dice que está agotada y se ofrecen las que quedan.
- **Cuando se publiquen cupos o inscripción de las charlas abiertas:** respuesta de la pregunta 11.
- **Del 5 al 8 de noviembre:** las respuestas pasan a "hoy" y "ahora": qué sesión sigue, dónde, cómo entrar.
- **Desde el 9 de noviembre:** agradecer y remitir a Instagram. Sin compra.
