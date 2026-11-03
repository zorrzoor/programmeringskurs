#!/usr/bin/env bash
# Browser tests (Playwright, Chromium) against the production image, as the cluster runs it. The Playwright image is
# big (~2 GB): it is only pulled here and in CI, and removed afterwards unless KEEP_PLAYWRIGHT=1.
#   scripts/browser-test.sh [image]     default image: programmeringskurs:dev (make image)
set -euo pipefail
cd "$(dirname "$0")/.."

RUNTIME=${RUNTIME:-podman}
IMAGE=${1:-programmeringskurs:dev}
PLAYWRIGHT=$(sed -n 's/^PLAYWRIGHT_IMAGE := //p' Makefile)
NAME=kurs-browser-$$
NAME_PUBLIK=kurs-browser-publik-$$
DATA=$(mktemp -d)
DATA_PUBLIK=$(mktemp -d)
port=${PORT:-18080}
port_publik=$((port + 1))
cleanup() {
    $RUNTIME rm -f $NAME $NAME_PUBLIK >/dev/null 2>&1 || true
    rm -rf "$DATA" "$DATA_PUBLIK"
    [[ -n ${KEEP_PLAYWRIGHT:-} ]] || $RUNTIME rmi "$PLAYWRIGHT" >/dev/null 2>&1 || true
}
trap cleanup EXIT
chmod 0777 "$DATA" "$DATA_PUBLIK"

$RUNTIME run -d --name $NAME --read-only --tmpfs /tmp --cap-drop ALL --user 1000:1000 -v "$DATA:/data" -p "127.0.0.1:$port:8080" "$IMAGE" >/dev/null
# The same image as the public instance (KURS_LAGE=publik: a code per name, no personal greeting).
$RUNTIME run -d --name $NAME_PUBLIK --read-only --tmpfs /tmp --cap-drop ALL --user 1000:1000 -v "$DATA_PUBLIK:/data" \
    -e KURS_LAGE=publik -e MAX_NAMES=2000 -p "127.0.0.1:$port_publik:8080" "$IMAGE" >/dev/null
for p in $port $port_publik; do
    for _ in $(seq 1 50); do
        curl -fs "http://127.0.0.1:$p/api/halsa" >/dev/null 2>&1 && break
        sleep 0.2
    done
done
$RUNTIME run --rm --network host -e E2E_URL="http://127.0.0.1:$port" -e E2E_URL_PUBLIK="http://127.0.0.1:$port_publik" -v "$PWD:/work:Z" -w /work "$PLAYWRIGHT" \
    npx playwright test "${@:2}"
