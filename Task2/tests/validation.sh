#!/bin/bash
set -e

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Running validation..."
COUNT=$(docker exec -i postgres-db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT COUNT(*) FROM Book;")

if [ "$COUNT" -eq 0 ]; then
  echo "Validation failed: no books found"
  exit 1
else
  echo "Validation passed: $COUNT book(s) found"
fi

