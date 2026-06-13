BUNDLE := ruby -S bundle
JEKYLL := $(BUNDLE) exec jekyll

HOST ?= 127.0.0.1
PORT ?= 4001

.PHONY: help install build serve serve-drafts clean

help:
	@echo "Available targets:"
	@echo "  make install       Install Ruby gems from Gemfile"
	@echo "  make build         Build site into _site/"
	@echo "  make serve         Run local Jekyll server"
	@echo "  make serve-drafts  Run server including draft posts"
	@echo "  make clean         Remove generated Jekyll artifacts"
	@echo ""
	@echo "Optional variables:"
	@echo "  HOST=127.0.0.1  PORT=4001"

install:
	$(BUNDLE) install

build:
	$(JEKYLL) build

serve:
	$(JEKYLL) serve --host $(HOST) --port $(PORT)

serve-drafts:
	$(JEKYLL) serve --drafts --host $(HOST) --port $(PORT)

clean:
	$(JEKYLL) clean
