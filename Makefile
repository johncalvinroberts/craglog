COMPOSE_FILE = ./docker/docker-compose.yml

docker-up:
	docker-compose -f ${COMPOSE_FILE} up -d
.PHONY: docker-up  
docker-down:
	docker-compose -f ${COMPOSE_FILE} down
.PHONY: docker-down
restart-docker: docker-down docker-up
bootstrap-dev:
	docker-compose -f ${COMPOSE_FILE} up -d mongo redis
start-backend:
	cd backend && npm start
dev-backend:
	cd backend && yarn dev
dev-jobs:
	cd jobs && yarn dev
dev-all: dev-jobs dev-backend
dev-frontend:
	cd frontend && yarn start
seed:
	cd backend && yarn seed
