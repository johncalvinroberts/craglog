COMPOSE_FILE = ./docker-compose.yml

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
seed:
	cd backend && yarn seed
build-frontend:
	cd frontend && yarn && yarn build
build-backend:
	cd backend && yarn && yarn build
run-backend:
	cd backend && yarn start:prod