# All tooling runs in containers; the workstation only needs podman and make.
SHELL := bash
.SHELLFLAGS := -euo pipefail -c
.DEFAULT_GOAL := help
MAKEFLAGS += --no-builtin-rules

RUNTIME ?= podman
# Same base as the Dockerfile (Dependabot watches the Dockerfile; `make lint` checks that they agree).
NODE_IMAGE := $(shell sed -n 's/^FROM \(docker.io\/library\/node:[^ ]*\).*/\1/p' Dockerfile | head -1)
PORT ?= 8080

NODE_RUN = $(RUNTIME) run --rm -i --userns=keep-id --user "$$(id -u):$$(id -g)" \
	-e HOME=/tmp -e npm_config_cache=/tmp/npm -v "$(CURDIR):/work:Z" -w /work $(NODE_EXTRA) $(NODE_IMAGE)

.PHONY: help
help: ## Show available targets
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk -F':.*?## ' '{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

node_modules/.installed: package.json package-lock.json
	$(NODE_RUN) npm ci --no-audit --no-fund
	touch $@

.PHONY: deps
deps: node_modules/.installed ## Install the locked npm dependencies (in a container)

.PHONY: lock
lock: ## Update package-lock.json after editing package.json
	$(NODE_RUN) npm install --no-audit --no-fund --package-lock-only

.PHONY: test
test: deps ## Server tests (node:test, real HTTP against a temporary database)
	$(NODE_RUN) npm test

.PHONY: typecheck
typecheck: deps ## TypeScript type check
	$(NODE_RUN) npm run typecheck

.PHONY: lint
lint: typecheck test ## Type check, tests and the repo checks
	scripts/check-repo.sh

# The shared EE (zorrzoor/ee) has kubectl and kubeconform. Until its package is readable from here, build it
# locally from the ee repo (make ee) and use EE_IMAGE=localhost/ee:latest.
EE_IMAGE ?= localhost/ee:latest

.PHONY: validate
validate: ## Validate deploy/ (kustomize + kubeconform) in the shared EE
	$(RUNTIME) run --rm --userns=keep-id --user "$$(id -u):$$(id -g)" -e HOME=/tmp -v "$(CURDIR):/work:Z" -w /work \
		$(EE_IMAGE) scripts/validate-deploy.sh

.PHONY: dev
dev: ## Run the server on http://localhost:$(PORT) with a throwaway database (Ctrl-C to stop)
	$(RUNTIME) run --rm -it --userns=keep-id --user "$$(id -u):$$(id -g)" -e HOME=/tmp -e PORT=8080 \
		-e DATABASE_PATH=/tmp/dev/kurs.db -e WEB_DIR=/work/web/public \
		-p 127.0.0.1:$(PORT):8080 -v "$(CURDIR):/work:Z" -w /work $(NODE_IMAGE) node server/main.ts

.PHONY: image
image: ## Build the container image locally (tag programmeringskurs:dev)
	$(RUNTIME) build -t programmeringskurs:dev .

.PHONY: clean
clean: ## Remove node_modules and the local dev image
	rm -rf node_modules
	-$(RUNTIME) rmi programmeringskurs:dev 2>/dev/null
