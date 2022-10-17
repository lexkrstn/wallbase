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
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT ?? '', 10),
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
    connection: {
      ...commonConfig.connection,
      database: process.env.DB_NAME + '_test',
    },
  },
  production: commonConfig,
};
