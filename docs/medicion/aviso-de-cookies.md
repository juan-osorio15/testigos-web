# Aviso de cookies

Cómo funciona el aviso de cookies del sitio, por qué es así y qué no se debe cambiar. Vigente desde el 2026-10-26. Código: `src/components/ConsentNotice.astro`; textos: claves `consent.*` de `src/ui.ts`.

## Para qué existe

Las cookies de analítica y publicidad (GA4 y el píxel de Meta) son la base de la medición: sin aceptación no hay retargeting ni datos de campaña por persona. En Colombia no hay una ley específica de cookies, pero la SIC aplica la Ley 1581 a las que reconocen al navegador: la aceptación tiene que ser previa, expresa e informada (dictamen en `docs/legal/revision-legal-2026-09-15-medicion.md`). Ninguna etiqueta carga antes de "Aceptar".

El objetivo es doble: que casi todos acepten sin pensarlo y que el aviso no estorbe la compra.

## Comportamiento

1. **Al entrar no hay aviso.** El hero tiene la pantalla entera.
2. **Al bajar más de un cuarto de pantalla**, el panel sube desde el borde inferior (500 ms, lineal) y, al mismo tiempo, todo lo de encima se oscurece de forma pareja y suave (velo de tinta al 25 %, 450 ms con `cubic-bezier(0.16, 1, 0.3, 1)`: arranca de golpe y frena suave). El velo no captura clics: la página se sigue usando, incluido "Comprar boletas".
3. **Una vez fuera, se queda** en esa página aunque la persona vuelva a subir. En cada página nueva empieza otra vez escondido. En una página demasiado corta para bajar, sale de una vez.
4. **El panel**: crema de la marca, sin borde, de lado a lado, cerca del 18 % de la pantalla en celular y en computador (20 % en un celular pequeño). Lleva:
   - el título estándar **"Usamos cookies"**;
   - una línea: "Eventalist las usa para mejorar tu experiencia en el sitio." y el enlace a la política;
   - tres frases cortas con chulito oliva: "No vendemos tus datos", "Solo para mejorar el sitio", "Sin anuncios si ya compraste" (en celular no salen en el panel, solo en "Configurar", para que quepa en una quinta parte de la pantalla);
   - un botón grande **Aceptar** en terracota y, en texto pequeño subrayado, "Configurar".
5. **Solo se quita decidiendo.** Sin ×, sin Escape, sin clic fuera.
6. **A los 7 segundos** de salir el panel, si no hay decisión, el botón Aceptar suelta un halo terracota que se desvanece, cada 1,6 s. El botón no se mueve ni cambia de tamaño. Con "reducir movimiento" activado, queda un marco de tinta fijo.
7. **"Configurar"** abre una tarjeta centrada:
   - arriba, las tres frases como titulitos en negrilla oliva, cada una con una línea de explicación;
   - las dos categorías, Analítica y Publicidad, **activadas**: quien no las quiere las apaga una por una;
   - justo debajo de los interruptores, el botón **Guardar** (borde de tinta), para quien se tomó el trabajo de apagarlas;
   - al final, el botón grande **Aceptar todas** en terracota y el enlace a la política.
   Cerrar la tarjeta sin decidir deja el panel donde estaba. Guardar con las dos apagadas no acepta nada y el aviso no vuelve en esa sesión.
8. **Gestor del pie de página** ("Cookies y preferencias"): muestra el estado, la fecha y el identificador de la aceptación, y permite cambiar o retirar.
9. **Versión del aviso** (`consentVersion` en `src/config.ts`): cambiarla vuelve a pedir la aceptación a todos, incluidos quienes ya aceptaron.

## Reglas del titular

- Cerrar el aviso nunca se vuelve más fácil: nada de ×, de "Rechazar" del mismo tamaño, ni de categorías apagadas por defecto.
- Nunca una barrita delgada: se ignora.
- Nunca un modal que bloquee la página al entrar: generaba fricción y tapaba el hero.
- Los textos sí se pueden simplificar, siempre con palabras que la gente ya ha visto en todas partes.

## Por qué así (investigación del 2026-10-26)

- Las barritas pequeñas casi no se responden: 9,6 % abajo y 2,9 % arriba. Un aviso que tapa contenido llega al 37 %, porque "no dejaba leer". Fuente: Utz y otros, "(Un)informed Consent", más de 80.000 visitas, https://arxiv.org/abs/1909.02638
- Resaltar "Aceptar" y traer las opciones activadas mueve mucho la decisión: casi todos dejan lo que viene por defecto. Dos opciones simples se aceptan más que una lista de categorías (mismo estudio).
- La redacción mueve poco: decir "cookies" en lugar de "tus datos" cambia el resultado muy poco, y el enlace a la política no tuvo efecto medible. Por eso el texto es el estándar.
- Hay proveedores que dicen que un modal acepta más que una barra (55 a 60 % frente a 35 a 40 %), sin citar la fuente. El panel con velo busca el mismo efecto sin bloquear.

## Historia

Franja discreta con × (2026-09-17) → modal centrado que bloqueaba (2026-09-18 y 2026-10-15) → panel que sale al bajar, con velo (2026-10-26) → panel más bajo (de 25 % a 18 % de la pantalla; en celular, de un tercio a 18 %) y velo más claro (de 50 % a 25 %), para que quien solo quiere comprar no se enrede y quien mira con cuidado igual lo note (2026-10-28).

## Para replicarlo en otro evento

Copiar `ConsentNotice.astro`, las claves `consent.*` de `ui.ts` y `src/measurement/consent.ts` con `tags.ts`. Ajustar el umbral de aparición si la portada no tiene un hero de pantalla completa. La tercera frase ("Sin anuncios si ya compraste") solo vale si los compradores están excluidos de los anuncios en Meta y Google.
