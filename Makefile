.PHONY: clean coldstart mrproper up build
all: build up

compose := docker-compose \
	-f docker-compose.yml \
	-f lisk_service/docker-compose.core.yml \
	-f lisk_service/docker-compose.gateway.yml \
	-f lisk_service/docker-compose.gateway-ports.yml \
	-f docker-compose.testnet.yml

up:
	cd ./docker && $(compose) up --detach

down:
	cd ./docker && $(compose) down --volumes --remove-orphans

build: build-core build-gateway

build-all: build-core build-gateway build-template build-tests

build-core:
	cd ./services/core && docker build --tag=lisk/service_core ./

build-gateway:
	cd ./services/gateway && docker build --tag=lisk/service_gateway ./

build-template:
	cd ./services/template && docker build --tag=lisk/service_template ./

build-tests:
	cd ./tests && docker build --tag=lisk/service_tests ./

build-local:
	npm ci
	cd ./framework && npm ci
	cd ./services/core && npm ci
	cd ./services/gateway && npm ci
	cd ./services/template && npm ci
	cd ./tests && npm ci

clean:
	docker rmi lisk/service_gateway lisk/service_core lisk/service_template lisk/service_tests


mrproper: down clean
