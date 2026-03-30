# ERP API

TODO:
- Output validation. For now it's not needed, but for future changes it would be good to validate outputs to not expose database internal data.
- Pagination for endpoints that list data

## Stack

- **NestJS** — framework
- **TypeORM** — database ORM
- **PostgreSQL** — database
- **Zod** (via nestjs-zod) — input validation
- **Swagger** — API docs available at `/api`

## Running

```bash
docker compose up --build
```

The app starts on port `3000`. Migrations run automatically on startup.

## API

### Trucks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/trucks` | List all trucks |
| `GET` | `/trucks/:code` | Get a truck |
| `POST` | `/trucks` | Create a truck |
| `PATCH` | `/trucks/:code` | Update a truck |
| `PATCH` | `/trucks/:code/status` | Update truck status |
| `DELETE` | `/trucks/:code` | Delete a truck |

### Query parameters — `GET /trucks`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | string | — | Filter by code or name |
| `sortBy` | `code` \| `name` | `code` | Sort field |
| `sortOrder` | `asc` \| `desc` | `asc` | Sort direction |

### Truck statuses

Allowed statuses transitions:

```
Loading → To Job → At Job → Returning → Loading (cycle)
```

- `Out Of Service` can be set from any status
- Any status can be set when the truck is `Out Of Service`

## Migrations

```bash
# Apply pending migrations
npm run migration:run

# Generate a new migration from entity changes
npm run migration:generate -- src/migrations/MigrationName

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## Tests

```bash
npm test
```
