/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('categories', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.string('name', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.bigInteger('creator_id').unsigned().notNullable();
    table.integer('tag_count').unsigned().notNullable().defaultTo(0);
    table.bigInteger('parent_id').unsigned().nullable();
    table.string('description', 1024).notNullable().defaultTo('');

    table.foreign('creator_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('parent_id')
      .references('categories.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('categories');
};
