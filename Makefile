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
	cd backend && npm run dev
dev-frontend:
	cd frontend && npm start