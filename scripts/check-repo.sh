#!/usr/bin/env bash
# Repo checks that need no tools: shell scripts parse, the workflows pin actions to a commit SHA, and the Playwright
# image matches the library.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in scripts/*.sh .githooks/*; do bash -n "$f"; done

unpinned=$(grep -rnE '^\s*-?\s*uses: ' .github/workflows | grep -vE 'uses: [^@]+@[0-9a-f]{40}( |$)' || true)
if [[ -n $unpinned ]]; then
    echo "actions must be pinned to a commit SHA:" >&2
    echo "$unpinned" >&2
    exit 1
fi
# The Playwright image must have the version of @playwright/test, or every browser test fails (#193).
image=$(sed -nE 's/^PLAYWRIGHT_IMAGE := mcr\.microsoft\.com\/playwright:v([0-9.]+)-.*/\1/p' Makefile)
library=$(sed -nE 's/^ *"@playwright\/test": "([0-9.]+)",?$/\1/p' package.json)
if [[ -z $image || $image != "$library" ]]; then
    echo "PLAYWRIGHT_IMAGE in Makefile (${image:-none}) must match @playwright/test in package.json (${library:-none})" >&2
    exit 1
fi
echo "check-repo: ok"
