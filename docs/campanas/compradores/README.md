# Compradores · avisos de servicio

Mensajes a quien ya compró, sobre la logística de su boleta. No son campañas de venta, así que no llevan precios ni invitan a comprar más. Solo le llegan a quien tiene entrada ese día: la audiencia `compradores_boleta` filtra por el producto en Pretix.

## Apertura de puertas · sábado 7 y domingo 8 de noviembre

A todo comprador, con cualquier boleta pagada; Panelistas, Staff e Invitados no entran (titular, 2026-11-07). Abrimos puertas a las 8:00 a.m. para la mañana y a las 2:00 p.m. para la tarde; el domingo no hay tarde.

### Correo

Configuración: `scripts/campanas/config/apertura-sabado-domingo.json`. Plantilla: `scripts/campanas/plantillas/apertura-sabado-domingo.html`. Asunto: "Horario de puertas de este sábado y domingo".

```sh
python3 scripts/campanas/campana.py lista apertura-sabado-domingo
python3 scripts/campanas/campana.py correo apertura-sabado-domingo                                          # vista previa
python3 scripts/campanas/campana.py correo apertura-sabado-domingo --prueba j.a.oso15@gmail.com --enviar  # prueba
python3 scripts/campanas/campana.py correo apertura-sabado-domingo --enviar                                 # envío real
```

### WhatsApp · `apertura_sabado_domingo_puertas`

Categoría: Utilidad, porque no invita a comprar. Idioma español (`es`), sin encabezado y sin variables.

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.) con el horario de puertas en la Hospedería Duruelo, Carrera 3 n.º 12-88, Villa de Leyva.

Sábado 7 de noviembre: abrimos a las 8:00 a.m. para los conversatorios de la mañana, que empiezan a las 9:00 a.m., y a las 2:00 p.m. para los de la tarde, que empiezan a las 3:00 p.m.

Domingo 8 de noviembre: abrimos a las 8:00 a.m. para los conversatorios de la mañana, que empiezan a las 9:00 a.m. Ese día no hay jornada de la tarde.

Te invitamos a llegar desde que abrimos para escoger mejor puesto, tomarte un café y mirar los libros.
```

- Pie: `Responde BAJA para no recibir más`
- Botón de enlace **Ver programación** → `https://testigosdelamemoria.com/?utm_source=whatsapp&utm_medium=mensaje&utm_campaign=apertura-puertas&utm_content=sabado-domingo#agenda`

Para el broadcast en respond.io:

1. `python3 scripts/campanas/campana.py respondio apertura-sabado-domingo` e importar el CSV de `~/Downloads` con la casilla **Do Not Overwrite** marcada en Tags.
2. Audiencia: la etiqueta `apertura-sabado-domingo-07112026`. No filtrar por la casilla **Baja**: la importación de compradores se la marca a todos. Quien de verdad pidió la baja ya queda fuera del CSV por la autorización del backend.

## Apertura de puertas · viernes 6 de noviembre

A quien tiene pase completo o boleta del viernes en la tarde. Abrimos puertas a las 2:00 p.m. para que la gente no se amontone justo antes de empezar; el programa empieza a las 3:00 p.m. (titular, 2026-11-06).

### Correo

Configuración: `scripts/campanas/config/apertura-viernes.json`. Plantilla: `scripts/campanas/plantillas/apertura-viernes.html`. Asunto: "Hoy abrimos puertas a las 2:00 p.m.".

```sh
python3 scripts/campanas/campana.py lista apertura-viernes
python3 scripts/campanas/campana.py correo apertura-viernes                                          # vista previa
python3 scripts/campanas/campana.py correo apertura-viernes --prueba j.a.oso15@gmail.com --enviar  # prueba
python3 scripts/campanas/campana.py correo apertura-viernes --enviar                                 # envío real
```

### WhatsApp · `apertura_viernes_puertas`

Categoría: Utilidad, porque no invita a comprar. Idioma español (`es`), sin encabezado y sin variables.

```
Hola. Te escribimos de Testigos de la Memoria (Eventalist S.A.S.). Hoy abrimos puertas a las 2:00 p.m. en la Hospedería Duruelo, Carrera 3 n.º 12-88, Villa de Leyva.

El programa empieza a las 3:00 p.m., pero te invitamos a llegar desde las 2:00 p.m. para escoger mejor puesto, tomarte un café, conversar y mirar los libros, sin el afán de entrar todos justo antes de empezar.

Si vienes también el sábado o el domingo: siempre abrimos puertas a las 8:00 a.m. para los conversatorios de la mañana, que empiezan a las 9:00 a.m., y a las 2:00 p.m. para los de la tarde, que empiezan a las 3:00 p.m. Antes de cada jornada te lo recordamos.

Nos vemos esta tarde.
```

- Pie: `Responde BAJA para no recibir más`
- Botón de enlace **Cómo llegar** → `https://www.google.com/maps/search/?api=1&query=Hospeder%C3%ADa+Duruelo+Villa+de+Leyva`

Para el broadcast en respond.io:

1. `python3 scripts/campanas/campana.py respondio apertura-viernes` e importar el CSV de `~/Downloads` con la casilla **Do Not Overwrite** marcada en Tags.
2. Audiencia: la etiqueta `apertura-viernes-06112026`. No filtrar por la casilla **Baja**: la importación de compradores se la marca a todos. Quien de verdad pidió la baja ya queda fuera del CSV por la autorización del backend.
