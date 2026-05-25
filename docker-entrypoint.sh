#!/bin/sh
set -e

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID:-}",
  APP_VERSION: "${APP_VERSION:-0.1.0}",
  ENVIRONMENT: "${ENVIRONMENT:-production}"
};
EOF

echo "env-config.js generated successfully"

exec "$@"