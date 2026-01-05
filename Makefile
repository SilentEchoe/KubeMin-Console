# Makefile for KubeMin-Console

# Variables
PACKAGE_MANAGER = pnpm
BUILD_DIR = dist
OUTPUT_ARCHIVE = release.tar.gz
IMAGE_NAME ?= kubemin-console
TAG ?= latest

.PHONY: all install dev build clean distclean package docker-build

all: install build

install:
	$(PACKAGE_MANAGER) install

dev:
	$(PACKAGE_MANAGER) run dev

build:
	$(PACKAGE_MANAGER) run build

clean:
	rm -rf $(BUILD_DIR)
	rm -f $(OUTPUT_ARCHIVE)

distclean: clean
	rm -rf node_modules

package: build
	tar -czf $(OUTPUT_ARCHIVE) -C $(BUILD_DIR) .
	@echo "Package created at $(OUTPUT_ARCHIVE)"

docker-build:
	docker build -t $(IMAGE_NAME):$(TAG) .

