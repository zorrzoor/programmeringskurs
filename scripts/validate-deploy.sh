#!/usr/bin/env bash
# Builds deploy/ (the root = private instance) and both overlays with kustomize and validates them against the Kubernetes
# and CRD schemas (cert-manager, Traefik). Also checks what makes the instances different. Needs kubectl and kubeconform on PATH:
# `make validate` runs it in the shared EE, CI installs them.
set -euo pipefail
cd "$(dirname "$0")/.."

for dir in deploy deploy/overlays/privat deploy/overlays/publik; do
    echo "==> $dir"
    kubectl kustomize "$dir" | kubeconform -strict -summary -kubernetes-version 1.37.0 \
        -schema-location default \
        -schema-location 'https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json'
done

root=$(kubectl kustomize deploy)
privat=$(kubectl kustomize deploy/overlays/privat)
publik=$(kubectl kustomize deploy/overlays/publik)
[[ $root == "$privat" ]] || { echo "deploy/ must build the same as overlays/privat (the private tenant applies the root)" >&2; exit 1; }
grep -q 'host: kurs.feuerliden.se' <<<"$privat" && grep -q 'value: privat' <<<"$privat"
grep -q 'host: kursen.feuerliden.se' <<<"$publik" && grep -q 'value: publik' <<<"$publik"
grep -q 'NEW_NAMES_PER_IP_PER_DAY' <<<"$publik" && grep -q 'UNUSED_NAME_HOURS' <<<"$publik"
! grep -q 'NEW_NAMES_PER' <<<"$privat" || { echo "the private instance must not limit new names" >&2; exit 1; }
! grep -q 'kursen.feuerliden.se' <<<"$privat" || { echo "private instance leaks the public host" >&2; exit 1; }
! grep -q 'kurs.feuerliden.se' <<<"$publik" || { echo "public instance leaks the private host" >&2; exit 1; }
# The namespace-dependent names must follow the tenant's namespace in the public overlay.
grep -q 'programmeringskurs-publik-kurs@kubernetescrd' <<<"$publik"
grep -q 'kurs.programmeringskurs-publik.svc$' <<<"$publik"
! grep -Eq 'kurs\.programmeringskurs\.svc|[ /]programmeringskurs-kurs@' <<<"$publik" || { echo "public overlay still names the private namespace" >&2; exit 1; }
echo "validate-deploy: ok"
