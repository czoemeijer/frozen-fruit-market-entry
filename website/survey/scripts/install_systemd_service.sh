#!/usr/bin/env bash
set -euo pipefail

if ! command -v systemctl >/dev/null 2>&1; then
  echo "systemd is not available on this machine."
  exit 1
fi

SERVICE_NAME="berrie-survey.service"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVICE_TEMPLATE="$PROJECT_DIR/deploy/systemd/berrie-survey.service"
TARGET_FILE="/etc/systemd/system/$SERVICE_NAME"

if [[ ! -f "$SERVICE_TEMPLATE" ]]; then
  echo "Missing service template: $SERVICE_TEMPLATE"
  exit 1
fi

TMP_FILE="$(mktemp)"
sed "s|__WORKDIR__|$PROJECT_DIR|g" "$SERVICE_TEMPLATE" > "$TMP_FILE"

sudo cp "$TMP_FILE" "$TARGET_FILE"
rm -f "$TMP_FILE"

sudo systemctl daemon-reload
sudo systemctl enable "$SERVICE_NAME"
sudo systemctl restart "$SERVICE_NAME"

sudo systemctl status "$SERVICE_NAME" --no-pager
