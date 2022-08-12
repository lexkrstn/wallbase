/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('collections', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.bigInteger('owner_id').unsigned().notNullable();
    table.string('name', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.integer('wallpaper_count').unsigned().notNullable().defaultTo(0);

    table.foreign('owner_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('collections');
};
