# Checklist diario · lo que se lanza a mano

Lo que toca cada día hasta el evento, una pieza por línea. Se marca con una X dentro de los corchetes:

- **Preparado:** todo listo para salir. En WhatsApp de API o respond.io, la plantilla aprobada por Meta (sin imagen); en grupos y lista de Fernando, la pieza y el texto; en correo, la vista previa y la prueba revisadas.
- **Mandado:** ya salió.

Los textos, las piezas y los pasos están en la carpeta de cada campaña (`<campaña>/correo/` y `<campaña>/whatsapp/`); las reglas, en `reglas.md`. Cuando una campaña nueva o un cambio de calendario toca un día, se actualiza aquí en el mismo cambio.

- **Horario de la Ley 2300:** lunes a viernes de 7:00 a.m. a 7:00 p.m., sábado de 8:00 a.m. a 3:00 p.m.
- **Un WhatsApp por persona al día** (titular, 2026-10-27): entre la API y respond.io, a nadie le llegan dos el mismo día, salvo a los interesados. Si dos campañas caen el mismo día, gana CD, después EX y después RC. El correo va aparte.

## Martes 3 nov

- Compradores importados a respond.io (antes de los broadcasts) · Hecho: [ ]
- Expirados importados a respond.io, **sin broadcast** (les llega EX2) · Hecho: [ ]
- **GV5** · grupos de Villa · negociaciones de paz, con Marisol Gómez y María Alejandra Villamizar · Preparado: [ ] · Mandado: [ ]
- **LF9** · lista de Fernando · Martha Soto · Preparado: [ ] · Mandado: [ ]
- **RC9** · inactivos · últimos días, con el afiche de las caras (reemplaza a RC7). Plantilla `rc9_ultimos_dias` aprobada en Meta y compradores importados antes · Preparado: [ ] · Mandado: [ ]
- **IN2** · interesados · API · mujeres periodistas · Preparado: [ ] · Mandado: [ ]
- **EX2** · expirados · API · narcotráfico · Preparado: [ ] · Mandado: [ ]
- Plantilla `ex3_cafe_del_domingo` creada en WhatsApp Manager (para EX3 del jueves) · Hecho: [ ]
- **FA vouchers** · familia · vouchers reales creados en Pretix y `vouchers --revisar` sin errores, antes de cualquier envío (`familia/README.md`, paso 4) · Hecho: [ ]
- **FA correo** · familia · `correo familia-etapa1` y `correo familia-etapa2` · Preparado: [ ] · Mandado: [ ]
- **FA WhatsApp** · familia · uno por uno desde respond.io, con la lista de `lista familia-etapa1` y `familia-etapa2` (`familia/whatsapp/README.md`) · Preparado: [ ] · Mandado: [ ]
- **GA** · Google Ads · seguimiento cada dos días · Hecho: [ ]

## Miércoles 4 nov

- Compradores importados a respond.io (antes de los broadcasts) · Hecho: [ ]
- **Expirados nuevos** · respond.io · Preparado: [ ] · Mandado: [ ]
- **GV11** · grupos de Villa · Ana María Echeverri y las guerrillas · Preparado: [ ] · Mandado: [ ]
- **LF10** · lista de Fernando · Marisol Gómez y María Alejandra Villamizar · Preparado: [ ] · Mandado: [ ]
- **RC8** · inactivos · mañana empieza · Preparado: [ ] · Mandado: [ ]

## Jueves 5 nov

- **GV6** · grupos de Villa · hoy empiezan las charlas abiertas (antes de las 10:00 a.m.). La pieza (afiche general) tiene a Ricardo Ospina y a León Valencia: hace falta otra. · Preparado: [ ] · Mandado: [ ]
- **LF11** · lista de Fernando · hoy empieza, con Ana María Echeverri (antes de las 10:00 a.m.) · Preparado: [ ] · Mandado: [ ]
- **EX3** · expirados · API · café del domingo con Yolanda Ruiz y María Elvira Samper · Preparado: [ ] · Mandado: [ ]
- **GA** · Google Ads · seguimiento cada dos días · Hecho: [ ]

## Viernes 6 nov

Antes, confirmar en Pretix que sigue habiendo boletas.

- **GV7** · grupos de Villa · mujeres periodistas: hoy empieza · Preparado: [ ] · Mandado: [ ]
- **LF12** · lista de Fernando · las mujeres periodistas del domingo · Preparado: [ ] · Mandado: [ ]

## Sábado 7 nov

- **GA** · Google Ads · seguimiento final: cuánto gastó y qué vendió cada palabra · Hecho: [ ]

---

## Cómo se hace cada cosa

- **Compradores a respond.io:** `python3 scripts/campanas/campana.py respondio compradores` e importar el CSV de `~/Downloads`. Quien compró queda como Customer y no le llegan CD ni RC.
- **Expirados a respond.io:** `python3 scripts/campanas/campana.py respondio expirados` e importar el CSV de `~/Downloads` con la casilla **Do Not Overwrite** marcada en Tags (si no, borra las etiquetas de días anteriores). El broadcast va al segmento con la etiqueta de hoy y sin la de ayer.
- **GV:** pieza de `grupos-villa/whatsapp/piezas/` y texto del bloque del día, publicados a mano.
- **LF:** mandarle a Fernando las piezas del día en orden (`-1`, `-2`, `-3`) y después el texto. Él lo reenvía.
- **RC:** broadcast en respond.io con la plantilla del día al segmento `inactivos`, mejor entre 9:00 y 11:00 a.m.
- **Carta de Fernando:** `correo carta-fernando --maximo N --enviar`, con N = 100 menos lo que ya salió ese día. Cada tanda sigue con los siguientes y no repite a nadie.
- **CD:** correo con `correo cierre-descuento-N-expirados` primero y después `correo cierre-descuento-N-interesados --saltar S --maximo M` (N es el día; S, los que ya recibieron una CD; M, el cupo que queda de los 100 de Resend), y broadcast en respond.io a todos los contactos sin compra, con la plantilla `_v2` del día (sin imagen). Antes, confirmar los precios en Pretix.
- **GA:** con `python3 scripts/ads/ads.py buscar`, gasto y clics de la campaña, términos de búsqueda (excluir lo que no sea de quien va a Villa de Leyva o busca el evento) y gasto por palabra (pausar la que lleve 30.000 COP sin ventas). En Pretix, ventas con fuente `google` y su `utm_term`. Si el porcentaje de impresiones es menor al 50 % y hay ventas, proponer más presupuesto al titular. Los cambios de plata los hace él.
- **IN y EX por la API:** revisar que `scripts/campanas/config/interesados.json` y `expirados.json` tengan la plantilla de la semana (cuál va en `interesados/whatsapp/README.md` y `expirados/whatsapp/README.md`), y después:

```sh
python3 scripts/campanas/campana.py whatsapp interesados                 # a quién le llegaría
python3 scripts/campanas/campana.py whatsapp interesados --prueba 57XXXXXXXXXX --enviar
python3 scripts/campanas/campana.py whatsapp interesados --enviar
```

Lo mismo con `expirados`. Al final, `python3 scripts/campanas/campana.py registro`.
