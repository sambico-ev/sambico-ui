#!/bin/bash
# Builds the site and copies it to the Hetzner server, see DEPLOYMENT.md.
set -euo pipefail

: "${SAMBICO_HOST:?set SAMBICO_HOST, e.g. user@178.104.6.98}"

cd "$(dirname "$0")"
npm ci
npm run build
# --delete drops files of older builds; hashed names would pile up otherwise
rsync -az --delete dist/sambico-ui/ "$SAMBICO_HOST:/var/www/sambico/"
echo "Deployed to $SAMBICO_HOST:/var/www/sambico"
