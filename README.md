# Wallbase

![build](https://github.com/lexkrstn/wallbase/actions/workflows/build.yml/badge.svg)

Wallbase is a user-driven wallpaper gallery social network. All content is
provided by the uploaders.

Current status: under development.

## Installation on a local dev machine

### Option 1: as a docker container

> This option is recommended if you either got a powerful enough machine
> to run the application in Docker containers or Linux the OS.

1. Install Docker
2. The first time you run the app execute:
   ```bash
   npm run docker:dev -- up --build
   ```
   (with the `--build` flag at the end)
3. The next time you'll be able to startup the dev server without the `--build`
   flag:
   ```bash
   npm run docker:dev -- up
   ```

### Option 2: as a standalone app

> This option is NOT recommended if you either got  a powerful enough machine
> to run the application in Docker containers or Linux as the OS.

1. Install NodeJS, PostgreSQL
2. Install GraphicsMagick. On MacOS:
   ```bash
   brew install graphicsmagick
   ```
   On Ubuntu:
   ```bash
   sudo apt install graphicsmagick
   ```
3. Run:
   ```bash
   cd <PROJECT_DIR>
   npm run generate-dotenv
   npm run knex migrate:latest
   npm run knex seed:run
   npm run dev
   ```
4. Browse [http://localhost:3000](http://localhost:3000)

## Development

- To run the development server:
  - As a standalone app:
    ```bash
    npm run dev
    ```
  - A a docker container:
    ```bash
    npm run docker:dev -- up
    ```
- To run the linter:
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
- `ts-node` - typescript executor for standalone scripts in scripts/*
- `tsconfig-paths` - plugin for ts-node that loads path aliases from tsconfig
