# Fórmula visual · Testigos de la Memoria

Gramática de composición destilada de la Propuesta 1 del manual (`Testigos-Brand-01.pdf`, págs. 1-7) y validada en el hero del sitio web. Sirve de referencia para cualquier pieza nueva: posts, afiches, emails, presentaciones, merch.

Referencias construidas: la valla y la escarapela del manual (pág. 6) y el hero de testigosdelamemoria.com (rama `dev`).

---

## 1. Bloques que se tocan, no cajas que flotan

La pieza no es "contenido sobre un fondo": es una superficie dividida en rectángulos de color plano que comparten aristas.

- Ángulos rectos. Sin esquinas redondeadas (la única excepción: contenedores físicos como el porta-escarapela).
- Sin márgenes entre bloques, sin sombras, sin bordes decorativos entre ellos.
- El layout ES la composición: decidir la pieza es decidir cómo se reparte la superficie.

## 2. La tinta escribe, no pinta

El marrón `#210804` es **la tinta con la que se escribe sobre los bloques de color**, no un color de fondo.

- Patrón correcto: terracota de fondo, texto en tinta encima.
- Anti-patrón: fondo marrón con texto naranja (contraste sucio y ajeno al manual).
- El marrón como fondo se reserva para contrapuntos puntuales (portada del manual, una sección oscura de ritmo), nunca como base de la pieza principal.

## 3. Cada bloque tiene un oficio

| Color | Hex | Oficio |
|---|---|---|
| Terracota | `#d45b30` | El mensaje: ahí vive el titular |
| Crema | `#efe8df` | La identidad: logo o comillas, con aire |
| Azul cielo | `#74b3d6` | Los datos prácticos: fecha, lugar, info, en franja |
| Oliva | `#757522` | Categorías y acentos (p. ej. lo gratuito) |
| Ladrillo | `#7d290d` | Categorías y acentos; tinta secundaria sobre crema |
| Foto | b/n o duotono | El testimonio: documental, en bloque propio a sangre, nunca de fondo con texto encima |

## 4. Una sola firma: las comillas

El símbolo de las dos comillas (la mirada del testigo) aparece **una vez por pieza**, grande, "mirando" desde una esquina del bloque crema. No se repite como patrón decorativo ni se usa como textura.

## 5. Dos voces tipográficas

- **Grotesca bold en tinta** (en el sitio: Archivo 800): carga el mensaje. Titulares grandes, sin adornos.
- **Serif itálica** (en el sitio: Fraunces): SOLO como remate. Una línea ("la ven de frente.") o una cifra ("5–8"). Es el eco del wordmark. La serif nunca escribe párrafos.
- Etiquetas y datos: mayúsculas con tracking amplio, cuerpo pequeño, bold.

## 6. Los datos van en franja

La información práctica atraviesa la pieza como banda horizontal de color (típicamente cielo): cifra grande en serif + etiquetas en caps + llamado a la acción. Es el patrón de la valla y de la escarapela.

## 7. Proporciones guía

- Bloque del mensaje: ~55-60% del ancho.
- Columna identidad + foto: ~40%.
- Franja de datos: ~10-12% del alto.

## 8. Lo prohibido

Gradientes, glow/neón, parallax, sombras notorias (máx. 0-2px), esquinas redondeadas decorativas, el símbolo repetido como patrón, texto sobre foto, marrón de fondo como base, y el guion largo de pausa ( — ) en los textos: punto seguido, coma o "·".

---

*Última actualización: 2026-08-25. Cualquier pieza nueva debería poder señalarse en este documento bloque por bloque.*
