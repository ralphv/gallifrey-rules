.PHONY: default
default:
	echo 'Hello Doctor'

.PHONY: build
build:
	./docker-run npm install && npm run build

.PHONY: test
test:
	./docker-run npm install && npm test

.PHONY: trivy
trivy:
	docker run --rm -v .:/app/ aquasec/trivy fs /app/ --scanners vuln

liquibase-init:
	mkdir -p liquibase && docker run -u "$$(id -u):$$(id -g)" --rm -it  -v ./liquibase:/app -w /app liquibase:alpine init project

.PHONY: docker-compose-integration
docker-compose-integration:
	docker compose -f docker/tests/scheduled-events.compose.yaml down
	docker compose -f docker/tests/scheduled-events.compose.yaml up -d

.PHONY: devbox
devbox:
	UID=$$(id -u) GID=$$(id -g) docker compose run --rm devbox

.PHONY: create-postgres-scheduled-events
create-postgres-scheduled-events:
	docker run -it --rm \
		--network tests_default \
		-e POSTGRES_HOST='postgres' \
		-e POSTGRES_PASSWORD='1q2w3e4r5t6y' \
		-e POSTGRES_DB='postgres' \
		gallifrey-rules-tools \
		create-postgres-scheduled-events

.PHONY: create-kafka-connector-scheduled-events
create-kafka-connector-scheduled-events:
	docker run -it --rm \
		--network tests_default \
		-e POSTGRES_USERNAME='postgres' \
		-e POSTGRES_HOST='postgres' \
		-e POSTGRES_PASSWORD='1q2w3e4r5t6y' \
		-e POSTGRES_DB='postgres' \
		-e KAFKA_CONNECT_URL='http://connect:8083'	\
		gallifrey-rules-tools \
		create-kafka-connector-scheduled-events