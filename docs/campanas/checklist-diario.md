# Checklist diario · lo que se lanza a mano

Hoja corta de lo que toca cada día hasta el evento. El texto, las piezas y los pasos completos están en la carpeta de cada campaña, por medio (`<campaña>/correo/` y `<campaña>/whatsapp/`); las reglas, en `reglas.md`. Cuando una campaña nueva o un cambio de calendario toca un día, se actualiza aquí en el mismo cambio.

Horario de la Ley 2300: lunes a viernes de 7:00 a.m. a 7:00 p.m., sábado de 8:00 a.m. a 3:00 p.m. Domingo 1 y lunes 2 de noviembre (festivo), nada.

**Un WhatsApp por persona al día** (titular, 2026-10-27): entre la API y respond.io, a nadie le llegan dos el mismo día, salvo a los interesados. Si dos campañas caen el mismo día, gana CD, después EX y después RC. El correo va aparte.

## Todos los días

0. **Compradores a respond.io, antes de cualquier broadcast.** `python3 scripts/campanas/campana.py respondio compradores` e importar el CSV de `~/Downloads`: quien compró queda como Customer y no le llegan CD ni RC.
1. **Expirados a respond.io.** `python3 scripts/campanas/campana.py respondio expirados`, importar el CSV de `~/Downloads` en respond.io con la casilla **Do Not Overwrite** marcada en Tags (si no, borra las etiquetas de días anteriores) y mandar el broadcast al segmento con la etiqueta de hoy y sin la de ayer. **El 28 y el 29 solo se importan, sin broadcast:** les llega CD.
2. **GV · grupos de Villa.** Pieza de `grupos-villa/whatsapp/piezas/` y texto del bloque del día, publicados a mano.
3. **LF · Fernando.** Mandarle las piezas del día en orden (`-1`, `-2`, `-3`) y después el texto. Él lo reenvía.
4. **RC · inactivos.** Broadcast en respond.io con la plantilla del día al segmento `inactivos`, mejor entre 9:00 y 11:00 a.m.
5. **CD · cierre de la etapa 2, solo del 27 al 29 oct.** Correo a interesados y a expirados (`correo cierre-descuento-N-interesados` y `-expirados`, con N el día) y broadcast en respond.io a todos los contactos sin compra, con la pieza del día (`cierre-descuento/whatsapp/piezas/`). Antes, confirmar los precios en Pretix.

## Calendario

- **Martes 27 oct** · GV9X · LF4X · RC2X · CD1X · IN1X y EX1X (por la API, ver abajo)
- **Miércoles 28 oct** · GV3 · LF5 · CD2 (RC3 no se envía: a los inactivos les llega CD2)
- **Jueves 29 oct** · GV8 · LF6 · CD3, último día de la etapa 2 (RC4 no se envía: la reemplaza CD3)
- **Viernes 30 oct** · GV4 · LF7 · RC5 (desde hoy, revisar en Pretix que lo que nombra la plantilla siga a la venta)
- **Sábado 31 oct, antes de las 3:00 p.m.** · GV10 · LF8 · RC6
- **Martes 3 nov** · GV5 · LF9 · RC7 · IN2 y EX2 (por la API)
- **Miércoles 4 nov** · GV11 · LF10 · RC8
- **Jueves 5 nov** · GV6 · LF11
- **Viernes 6 nov** · GV7 · LF12

## Los martes, IN y EX por la API

Primero revisar la plantilla de la semana en `scripts/campanas/config/interesados.json` y `expirados.json` (cuál va en `interesados/whatsapp/README.md` y `expirados/whatsapp/README.md`).

```sh
python3 scripts/campanas/campana.py whatsapp interesados                 # a quién le llegaría
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar
python3 scripts/campanas/campana.py whatsapp interesados --enviar
```

Lo mismo con `expirados`. Al final, `python3 scripts/campanas/campana.py registro`.
