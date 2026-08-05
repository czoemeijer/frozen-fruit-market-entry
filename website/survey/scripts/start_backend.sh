#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

export SURVEY_PORT="${SURVEY_PORT:-8000}"
export SURVEY_DB_PATH="${SURVEY_DB_PATH:-$PROJECT_DIR/survey_data.db}"

cd "$PROJECT_DIR"
exec python3 backend.py
