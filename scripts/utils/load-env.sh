#!/bin/bash

# ============================================
# Simple Environment Loader
# ============================================
# Carrega o arquivo .env da raiz do projeto
# ============================================

# Get project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

# Load .env file if it exists
if [ -f "$ENV_FILE" ]; then
    set -a  # Export all variables
    source "$ENV_FILE"
    set +a  # Stop exporting
    echo "✓ Environment loaded from: $ENV_FILE"
else
    echo "⚠ Environment file not found: $ENV_FILE"
fi