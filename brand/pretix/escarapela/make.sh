#!/bin/sh
# Regenera el fondo de la escarapela (PDF) y su vista previa por categoría.
# Requiere Google Chrome. Uso: sh make.sh [categoría...]  (por defecto: todas)
set -e
cd "$(dirname "$0")"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for CAT in ${@:-panelista staff prensa}; do
  SLUG=$(node build.mjs "$CAT")
  "$CH" --headless=new --disable-gpu --allow-file-access-from-files --no-pdf-header-footer \
    --print-to-pdf="$PWD/../escarapela-$SLUG-fondo.pdf" "file://$PWD/fondo.html" 2>/dev/null
  "$CH" --headless=new --disable-gpu --allow-file-access-from-files --window-size=397,560 --force-device-scale-factor=2 \
    --screenshot="$PWD/preview-$SLUG.png" "file://$PWD/preview.html" 2>/dev/null
  echo "listo: brand/pretix/escarapela-$SLUG-fondo.pdf"
done
cp layout.json ../escarapela-layout.json
echo "listo: brand/pretix/escarapela-layout.json"
