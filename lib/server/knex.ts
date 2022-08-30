import makeKnex from 'knex';
import knexfile from '../../knexfile';

const env = process.env.NODE_ENV || 'development';
const envMap: Record<typeof env[number], keyof typeof knexfile> = {
  development: 'development',
  production: 'production',
  test: 'testing',
};

export default makeKnex(knexfile[envMap[env]]);
