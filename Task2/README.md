# SQL Database with Flyway Migrations & CI/CD Pipeline


A complete database management solution with automated migrations, testing, and deployment using Docker, Flyway, and Azure DevOps.

```# Run validation test

make validate

## Database Schema & Migration Logic

# Tear down everything

### Schema Designmake down

The database follows a simple bookstore model:
- **Author** (id, name) - Authors of books
- **Publisher** (id, name) - Book publishers  
- **Book** (id, title, author_id, publisher_id) - Books with foreign key relationships

### Migration Strategy
Using **Flyway** for version-controlled database migrations:
- **V1__create_tables.sql**: Creates initial Author, Publisher, Book tables
- **V2__add_new_column.sql**: Adds additional columns (extensible)
- Sequential versioning ensures consistent database state across environments

## Local Development

### Prerequisites
- Docker & Docker Compose
- Make (optional, for convenience commands)

### Setup & Usage
```bash
# Start database service
make up

# Apply all pending migrations
make migrate

# Seed database with test data
make seed

# Run validation tests
make validate

# Rollback changes (if needed)
make rollback

# Stop and cleanup everything
make down
```

### Manual Docker Commands
```bash
# Alternative to Makefile commands
docker compose up -d db
docker compose run --rm flyway
docker exec -i postgres-db psql -U postgres -d booksdb -f /sql/seed/seed_data.sql
```

### Access Services
- **Database**: `localhost:5432` (postgres/postgres)
- **pgAdmin**: `localhost:5050` (admin@admin.com/admin)

## CI/CD Pipeline Architecture

The Azure DevOps pipeline (`azure-pipelines.yml`) implements a **three-stage deployment strategy**:

### Build Stage
**Purpose**: Validate configuration and prepare artifacts
- Checkout source code
- Validate `docker-compose.yml` syntax
- Prepare build artifacts for downstream stages
- **Fast feedback** on configuration issues

### Test Stage  
**Purpose**: Isolated testing with automatic cleanup
- Spin up **temporary** test database
- Apply migrations to test schema
- Seed test data
- Run validation tests (`Tests/validation.sh`)
- **Always cleanup** test resources (regardless of success/failure)
- **Rollback on failure** for debugging

### Deploy Stage
**Purpose**: Production deployment with persistent resources
- **Conditional execution** - only runs if tests pass
- Deploy to production environment
- Apply migrations to production database
- Seed production data
- **No cleanup** - resources remain running
- Display deployment summary

## Rollback Strategy

### Automatic Rollback Triggers
- **Test Stage**: Rollback triggered on validation failure
- **Local Development**: Manual rollback via `make rollback`

### Rollback Process (`scripts/rollback.sh`)
1. **Load credentials** from `.env` file
2. **Check database state** - query Flyway migration history
3. **Drop all tables** in correct order (handles foreign key dependencies)
   - Book (dependent table)
   - Author, Publisher (parent tables)  
   - flyway_schema_history (tracking table)
4. **Cleanup containers** and volumes
5. **Provide feedback** on rollback completion

### Rollback Safety
- **Test Environment**: Full rollback including container cleanup
- **Production Environment**: Rollback disabled to prevent accidental data loss
