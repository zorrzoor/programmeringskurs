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
DATA=$(mktemp -d)
port=${PORT:-18080}
cleanup() {
    $RUNTIME rm -f $NAME >/dev/null 2>&1 || true
    rm -rf "$DATA"
    [[ -n ${KEEP_PLAYWRIGHT:-} ]] || $RUNTIME rmi "$PLAYWRIGHT" >/dev/null 2>&1 || true
}
trap cleanup EXIT
chmod 0777 "$DATA"

$RUNTIME run -d --name $NAME --read-only --tmpfs /tmp --cap-drop ALL --user 1000:1000 -v "$DATA:/data" -p "127.0.0.1:$port:8080" "$IMAGE" >/dev/null
for _ in $(seq 1 50); do
    curl -fs "http://127.0.0.1:$port/api/halsa" >/dev/null 2>&1 && break
    sleep 0.2
done
$RUNTIME run --rm --network host -e E2E_URL="http://127.0.0.1:$port" -v "$PWD:/work:Z" -w /work "$PLAYWRIGHT" \
    npx playwright test "${@:2}"
