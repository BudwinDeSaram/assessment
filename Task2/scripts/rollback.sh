#!/bin/bash
set -e

if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "=== Database Rollback Script ==="
echo "This script will rollback database migrations and clean up resources"

# Check if the database container is running
if ! docker ps | grep -q postgres-db; then
    echo "Database container is not running. Nothing to rollback."
    exit 0
fi

echo "Starting rollback process..."

# Get current database version from Flyway schema history
echo "Checking current database state..."
CURRENT_VERSION=$(docker exec -i postgres-db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -t -c "SELECT version FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 1;" 2>/dev/null | xargs || echo "")

if [ -z "$CURRENT_VERSION" ]; then
    echo "No migrations found to rollback."
else
    echo "Current database version: $CURRENT_VERSION"
    
    # Drop all tables to ensure clean rollback
    echo "Rolling back database changes..."
    docker exec -i postgres-db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "
        DROP TABLE IF EXISTS Book CASCADE;
        DROP TABLE IF EXISTS Author CASCADE;
        DROP TABLE IF EXISTS Publisher CASCADE;
        DROP TABLE IF EXISTS flyway_schema_history CASCADE;
    " 2>/dev/null || echo "Some tables may not exist, continuing..."
fi

echo "Database rollback completed."
echo "=== Rollback completed successfully ==="