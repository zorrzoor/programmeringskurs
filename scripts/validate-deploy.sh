#!/usr/bin/env bash
# Builds deploy/ with kustomize and validates it against the Kubernetes and CRD schemas (cert-manager,
# Traefik). Needs kubectl and kubeconform on PATH: `make validate` runs it in the shared EE, CI installs them.
set -euo pipefail
cd "$(dirname "$0")/.."

kubectl kustomize deploy | kubeconform -strict -summary -kubernetes-version 1.37.0 \
    -schema-location default \
    -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
