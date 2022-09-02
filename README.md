# Wallbase

Wallbase is a user-driven wallpaper gallery website. All content is provided by
the uploaders. Users can upload wallpapers directly via the upload form found
on the top-left of the homepage. Though, you have to be logged in to be able
to upload wallpapers.

Current status: under development.

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
cp ./example.env ./.env
nano ./.env
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

To run the linter:

```bash
npm run lint
```

### Packages

- `dotenv` - loads *.env file data into process.env.* skipping existing vars
- `knex` - SQL query builder
- `db-errors` - provides wrapping PostgreSQL errors into separate classes
  (e.g. `UniqueViolationError`).
- `pg` - PostgreSQL client required by knex
- `passport` - to support authorization with social networks
- `formidable` - server side image uploading
- `zod` - typesafe validator
- `swr` - react hooks for data fetching (similar to react-query)
- `gm` - GraphicsMagick wrapper
- `geoip-lite` - free version of MaxMind's GeoIP database
- `cookie` - cookie parser / serializer
- `country-data` - large JSON files with country info (names, codes, langs, etc)
- `@fortawesome/*` - svg icons
- `country-code-emoji` - converts country codes to emoji country flags
