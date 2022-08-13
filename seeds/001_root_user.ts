import { Knex } from 'knex';
import { createUser, getUser, ROOT_USER_ID } from '../lib/users';

export async function seed(knex: Knex): Promise<void> {
  if (!await getUser(ROOT_USER_ID)) {
    await createUser({
      login: 'admin',
      email: 'admin@wallbase.net',
      password: process.env.ADMIN_PASSWORD ?? 'admin',
      activated: true,
    });
  }
};