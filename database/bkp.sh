#!/bin/bash

ENV_FILE=".env"
NOW=$(date +"%Y-%m-%d_%H-%M-%S")
OUT_DIR="database"
OUT_FILEAME="$OUT_DIR/bkp_$NOW.sql"

# Carregando variáveis env
export $(grep -v '^#' "$ENV_FILE" | xargs)

docker exec minhas-contas-db-dev-1 mariadb-dump -h 127.0.0.1 -u root -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE --single-transaction --quick > "$OUT_FILEAME"