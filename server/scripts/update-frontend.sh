#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/opt/deneblog/server"
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
ENV_FILE="$PROJECT_DIR/.env"
SERVICE_NAME="frontend"
LOG_TAG="[update-frontend]"

echo "$LOG_TAG start: $(date '+%F %T')"

cd "$PROJECT_DIR"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" pull "$SERVICE_NAME"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d "$SERVICE_NAME"
docker image prune -f >/dev/null 2>&1 || true

echo "$LOG_TAG done: $(date '+%F %T')"
