/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('users').insert({
    login: 'admin',
    email: 'admin@wallbase.net',
    password_hash: '',
    activated: true,
  });
};
