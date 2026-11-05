# All tooling runs in containers; the workstation only needs podman and make.
SHELL := bash
.SHELLFLAGS := -euo pipefail -c
.DEFAULT_GOAL := help
MAKEFLAGS += --no-builtin-rules

RUNTIME ?= podman
# Same base as the Dockerfile (Dependabot watches the Dockerfile; `make lint` checks that they agree).
NODE_IMAGE := $(shell sed -n 's/^FROM \(docker.io\/library\/node:[^ ]*\).*/\1/p' Dockerfile | head -1)
PORT ?= 8080
# Same version as @playwright/test in package.json (Dependabot keeps both; the browser must match the library).
PLAYWRIGHT_IMAGE := mcr.microsoft.com/playwright:v1.64.1-resolute@sha256:5804dd8c666684ea858091d52c91ef97974caa999b25f0f03efa485d9ffeb434

NODE_RUN = $(RUNTIME) run --rm -i --userns=keep-id --user "$$(id -u):$$(id -g)" \
	-e HOME=/tmp -e npm_config_cache=/tmp/npm -v "$(CURDIR):/work:Z" -w /work $(NODE_EXTRA) $(NODE_IMAGE)

.PHONY: help
help: ## Show available targets
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk -F':.*?## ' '{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

node_modules/.installed: package.json package-lock.json
	$(NODE_RUN) npm ci --no-audit --no-fund
	touch $@

.PHONY: npm
npm: ## Run npm in the container, e.g. make npm ARGS="install --save-exact -D vitest"
	$(NODE_RUN) npm $(ARGS)

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

# The shared EE (zorrzoor/ee) has kubectl and kubeconform. Its package is public (pulled without a login), so a clone
# can run `make validate` without the ee repo, which is private. Override with EE_IMAGE=localhost/ee:latest for a local build.
EE_IMAGE ?= ghcr.io/zorrzoor/ee:1.6

.PHONY: validate
validate: ## Validate deploy/ (kustomize + kubeconform) in the shared EE
	$(RUNTIME) run --rm --userns=keep-id --user "$$(id -u):$$(id -g)" -e HOME=/tmp -v "$(CURDIR):/work:Z" -w /work \
		$(EE_IMAGE) scripts/validate-deploy.sh

.PHONY: build
build: deps ## Build the site into web/dist
	$(NODE_RUN) npm run build

.PHONY: browser-test
browser-test: deps image ## Browser tests (Playwright) against the image; pulls a ~2 GB image that is removed afterwards
	RUNTIME=$(RUNTIME) scripts/browser-test.sh

.PHONY: dev
dev: build ## Run the server on http://localhost:$(PORT) with a throwaway database (Ctrl-C to stop)
	$(RUNTIME) run --rm -it --userns=keep-id --user "$$(id -u):$$(id -g)" -e HOME=/tmp -e PORT=8080 \
		-e DATABASE_PATH=/tmp/dev/kurs.db -e WEB_DIR=/work/web/dist \
		-p 127.0.0.1:$(PORT):8080 -v "$(CURDIR):/work:Z" -w /work $(NODE_IMAGE) node server/main.ts

.PHONY: image
image: ## Build the container image locally (tag programmeringskurs:dev)
	$(RUNTIME) build -t programmeringskurs:dev .

.PHONY: clean
clean: ## Remove node_modules and the local dev image
	rm -rf node_modules
	-$(RUNTIME) rmi programmeringskurs:dev 2>/dev/null
