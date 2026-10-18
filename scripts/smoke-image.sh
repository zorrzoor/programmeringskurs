#!/usr/bin/env bash
# Smoke test of the container image the way the cluster runs it: unprivileged, read-only root
# filesystem, only /data writable. Checks the health endpoint, the start page, saving a name and
# progress, and that the data survives a restart of the container.
set -euo pipefail
cd "$(dirname "$0")/.."

RUNTIME=${RUNTIME:-podman}
IMAGE=${1:-programmeringskurs:dev}
NAME=kurs-smoke-$$
DATA=$(mktemp -d)
port=${PORT:-18080}
trap '$RUNTIME rm -f $NAME >/dev/null 2>&1 || true; rm -rf "$DATA"' EXIT
chmod 0777 "$DATA" # the container user is 1000, the directory belongs to the caller

start() {
    $RUNTIME run -d --name $NAME --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges \
        --user 1000:1000 -v "$DATA:/data" -p "127.0.0.1:$port:8080" "$IMAGE" >/dev/null
    for _ in $(seq 1 50); do
        curl -fs "http://127.0.0.1:$port/api/halsa" >/dev/null 2>&1 && return 0
        sleep 0.2
    done
    $RUNTIME logs $NAME >&2
    echo "smoke: server did not start" >&2
    exit 1
}
url=http://127.0.0.1:$port

start
curl -fs "$url/" | grep -q "Programmeringskurs"
[[ $(curl -s -o /dev/null -w '%{http_code}' -X POST -d '{"namn":"Rök"}' "$url/api/namn") == 201 ]]
curl -fs -X PUT -d '{"kod":"print(1)","klar":true,"tid":1}' "$url/api/namn/R%C3%B6k/ovningar/o1" >/dev/null
$RUNTIME rm -f $NAME >/dev/null
start
curl -fs "$url/api/namn/R%C3%B6k/framsteg" | grep -q '"klar":true'
[[ $($RUNTIME exec $NAME id -u) == 1000 ]]

# TLS, as the cluster runs it (certificate and key mounted from a secret). Needs the openssl command.
if command -v openssl >/dev/null; then
    $RUNTIME rm -f $NAME >/dev/null
    TLS=$(mktemp -d)
    trap '$RUNTIME rm -f $NAME >/dev/null 2>&1 || true; rm -rf "$DATA" "$TLS"' EXIT
    openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -days 1 -subj /CN=localhost \
        -keyout "$TLS/tls.key" -out "$TLS/tls.crt" 2>/dev/null
    chmod 0755 "$TLS"
    chmod 0644 "$TLS"/*
    $RUNTIME run -d --name $NAME --read-only --tmpfs /tmp --cap-drop ALL --user 1000:1000 -v "$DATA:/data" \
        -v "$TLS:/tls:ro" -e TLS_CERT_FILE=/tls/tls.crt -e TLS_KEY_FILE=/tls/tls.key -p "127.0.0.1:$port:8080" "$IMAGE" >/dev/null
    for _ in $(seq 1 50); do
        curl -fsk "https://127.0.0.1:$port/api/halsa" >/dev/null 2>&1 && break
        sleep 0.2
    done
    curl -fsk "https://127.0.0.1:$port/api/namn/R%C3%B6k/framsteg" | grep -q '"klar":true'
    echo "smoke: TLS ok"
else
    echo "smoke: openssl not found, TLS not tested"
fi
echo "smoke: ok"
