import knex, { Knex } from 'knex';
import knexfile from '../knexfile';

const env = process.env.NODE_ENV || 'development';
const configOptions = (knexfile as any)[env] as Knex.Config;

export default knex(configOptions);
