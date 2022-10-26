// @ts-check
const dotenv = require('dotenv');
const path = require('path');

const ROOT_DIR = process.env.PROJECT_ROOT || __dirname;

const result = dotenv.config({
  path: path.resolve(ROOT_DIR, '.env'),
});

if (result.error) {
  // eslint-disable-next-line no-console
  console.warn('Failed to load dotenv config');
}

const commonConfig = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/wallbase',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: path.join(ROOT_DIR, 'migrations'),
  },
  seeds: {
    directory: path.join(ROOT_DIR, 'seeds'),
  },
};

module.exports = {
  development: commonConfig,
  testing: {
    ...commonConfig,
    connection: process.env.DATABASE_URL + '_test',
  },
  production: commonConfig,
};
