# Nota para la metodología

Entregable 4 de `specs/004-fuentes-de-verdad`. Qué enseña ordenar las fuentes de verdad de Testigos para la plantilla de repo de evento (`prompt-skill-init-new-event.md`, sección 2: "una plantilla de repo por evento"). Fecha: 2026-10-24.

## Lo que entra a la plantilla tal cual

- **Los fundamentos del evento son los datos del sitio, no un archivo aparte.** `src/data/` (evento, sedes, boletas y etapas, agenda, panelistas) y `src/config.ts` (integraciones). El sitio los necesita tipados y es el primero en usarlos; no tiene sentido otra fuente al lado.
- **El build exporta los hechos** en `/datos/evento.json` (`src/pages/datos/evento.json.ts`). Todo lo que no es el sitio (campañas en Python, generadores en Node, informe, comprobación) lee esa exportación con `scripts/lib/hechos.py` o `hechos.mjs`, que se niegan a correr si es más vieja que la fuente. Estos tres archivos se copian sin cambios al próximo evento.
- **Las reglas son datos, no lógica escondida en un componente.** Qué sesiones cubre cada boleta vivía dentro de `TicketSection.astro`; por eso una plantilla de correo pudo decir "dos conversatorios" sin que nada lo contradijera. Va en `src/data/boletas.ts` desde el día uno.
- **La redacción lleva variables, no hechos.** `ui.ts` y las plantillas de correo escriben `{fechas}`, `{sedeConversatorios}`, `{{precio_pase_completo}}`. Cambiar una fecha es una línea en `src/data/`.

## Lo que se pega a mano: verificar, no generar

- **Convención de documento**: lo que se pega en otro sistema va en un bloque de código; lo demás son notas. Así una máquina sabe qué revisar.
- **`npm run verificar`** coteja esas piezas con la exportación: precios que no existen, fechas vencidas, grafía de panelistas, términos retirados, enlaces viejos. La lista de patrones empieza vacía y crece con cada error real. En Testigos, los 8 errores que llegaron al público (precio de la etapa 1 cinco días en el sitio, "cuatro días" en un correo, "dos conversatorios" a 29 personas, el WhatsApp equivocado siete días, cinco correcciones de panelistas) son hoy sus casos de prueba.
- **`docs/copias-externas.md` desde el día uno**, vacía: cada vez que algo se publica afuera (Pretix, chatbot, Meta, Google Ads, impresos), se anota qué hechos tiene y qué lo obliga a cambiar.
- **Plantillas de Meta sin hechos fijos.** No se editan después de aprobadas: precio, fecha de etapa o número van como variables.
- **Chatbot en dos archivos**: la ficha (hechos) y el prompt (comportamiento), versionados por separado, y los precios consultados en vivo en la tienda. Eso quitó la copia más grande y la más riesgosa.

## Decisiones que la plantilla debe pedir al principio

- **Vocabulario público.** En Testigos "franja" (interno) se coló al público durante semanas, y "talleres" convivió con "charlas abiertas". El nombre público de cada tipo de boleta y de sesión es un dato de los fundamentos.
- **Un solo archivo de estado.** Sin él, los pendientes quedaron repartidos en cinco archivos y `pendientes-002.md` acumuló casillas vencidas que nadie cierra.
- **Dónde viven las reglas para agentes.** `CLAUDE.md` está ignorado en `~/.gitignore_global`: hay que decidir si la plantilla lo versiona (y con qué nombre) o si las reglas viven en el `README.md`.
- **Credenciales fuera del árbol del repo.** Al mover `docs/credenciales.md` a `docs/proyecto/`, la regla de `.gitignore` quedó apuntando a la ruta vieja en `main` y el archivo dejó de estar ignorado en un repo público. Un archivo de llaves dentro de `docs/` es una trampa.

## Lo que sobró

- Mover las herramientas a `scripts/` por principio: los generadores de imágenes y de boletas viven mejor junto a sus diseños. Lo que hacía falta era un índice (`scripts/README.md`), comandos en `package.json` y que leyeran la fuente.
- Un bloque generado dentro de la ficha del chatbot: la ficha la escribe una persona; basta cotejarla con la programación.

## Para el trabajo con agentes

- **Una sesión, un árbol de trabajo.** Dos sesiones sobre la misma carpeta dejaron copias sin commit del trabajo de otra y obligaron a comparar archivo por archivo antes de mezclar. Cada sesión en su propio worktree, y commit antes de cambiar de tarea.
- **Comparar la salida antes y después de cada cambio** (HTML de las 36 páginas, vistas previas de las campañas, PDF de la boleta) fue lo que permitió tocar un sitio que vende sin miedo. El comparador vale más como herramienta de la plantilla que como paso manual.
