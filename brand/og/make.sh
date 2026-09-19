#!/bin/sh
# Regenera la imagen de vista previa para compartir (public/og/). Requiere
# Google Chrome. Cuando cambie el diseño, subir el número de versión del
# archivo aquí y en src/layouts/EventLayout.astro: WhatsApp guarda la
# vista previa por URL y solo la renueva si la URL de la imagen cambia.
set -e
cd "$(dirname "$0")"
OUT="$PWD/../../public/og/og-image-v3.png"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
node inline-logo.mjs
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars \
  --window-size=1200,630 --force-device-scale-factor=1 \
  --screenshot="$OUT" "file://$PWD/og.build.html" 2>/dev/null
echo "listo: $OUT"
