COMPOSE_FILE = ./docker/docker-compose.yml

up:
	docker-compose -f ${COMPOSE_FILE} up -d
.PHONY: up  
down:
	docker-compose -f ${COMPOSE_FILE} down
.PHONY: down
restart-docker: down up
dev-backend:
	cd backend && yarn dev
dev-frontend:
	cd frontend && yarn start
build-frontend:
	cd frontend && yarn && yarn build
seed:
	cd backend && yarn seed
build-backend:
	cd backend && yarn build
run-backend:
	cd backend && yarn start:prod