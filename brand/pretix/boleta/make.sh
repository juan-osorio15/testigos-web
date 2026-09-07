#!/bin/sh
# Regenera el fondo de la boleta (PDF) y su vista previa. Requiere Google Chrome.
set -e
cd "$(dirname "$0")"
node build.mjs
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer \
  --print-to-pdf="$PWD/../boleta-fondo.pdf" "file://$PWD/fondo.html" 2>/dev/null
"$CH" --headless=new --disable-gpu --allow-file-access-from-files --window-size=397,560 --force-device-scale-factor=2 \
  --screenshot="$PWD/preview.png" "file://$PWD/preview.html" 2>/dev/null
cp layout.json ../boleta-layout.json
echo "listo: brand/pretix/boleta-fondo.pdf y brand/pretix/boleta-layout.json"
