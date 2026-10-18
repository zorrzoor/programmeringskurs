#!/usr/bin/env bash
# Repo checks that need no tools: shell scripts parse, the workflows pin actions to a commit SHA.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in scripts/*.sh .githooks/*; do bash -n "$f"; done

unpinned=$(grep -rnE '^\s*-?\s*uses: ' .github/workflows | grep -vE 'uses: [^@]+@[0-9a-f]{40}( |$)' || true)
if [[ -n $unpinned ]]; then
    echo "actions must be pinned to a commit SHA:" >&2
    echo "$unpinned" >&2
    exit 1
fi
echo "check-repo: ok"
