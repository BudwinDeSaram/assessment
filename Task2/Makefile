include .env
export

up:
	docker compose up -d 

migrate:
	docker compose run --rm flyway

seed:
	docker exec -i postgres-db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /sql/seed/seed_data.sql

validate:
	chmod +x tests/validation.sh
	./tests/validation.sh

rollback:
	chmod +x scripts/rollback.sh
	./scripts/rollback.sh

down:
	docker compose down -v