# Wallbase 2

## Prerequisites

- NodeJS
- PostgreSQL
- GraphicsMagick
  MacOS:
  ```bash
  brew install graphicsmagick
  ```
  Ubuntu:
  ```bash
  sudo apt install graphicsmagick
  ```

## Installation

```bash
cd <PROJECT_DIR>
npm run knex migrate:latest
npm run knex seed:run
npm run build
npm run start
```

## Development

To run the development server:

```bash
npm run dev
```

### Packages

- `dotenv` - loads *.env file data into process.env.* skipping existing vars
- `knex` - SQL query builder
- `ts-node` - required for knex to work with seed and migrations in TypeScript
- `db-errors` - provides wrapping PostgreSQL errors into separate classes
  (e.g. `UniqueViolationError`).
- `pg` - PostgreSQL client required by knex
- `passport` - to support authorization with social networks
