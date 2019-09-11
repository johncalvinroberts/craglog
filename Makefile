COMPOSE_FILE = ./docker/docker-compose.yml

docker-up:
	docker-compose -f ${COMPOSE_FILE} up -d
docker-down:
	docker-compose -f ${COMPOSE_FILE} down
bootstrap-dev:
	docker-compose -f ${COMPOSE_FILE} up -d mongo redis
