/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('featured_wallpapers', table => {
    table.uuid('id').notNullable().primary();
    table.timestamp('featured_at').notNullable().defaultTo(knex.fn.now());
    table.bigInteger('user_id').notNullable().index();
    table.boolean('enabled').notNullable().defaultTo(true);
    table.string('mimetype', 64).notNullable();

    table.foreign('id')
      .references('wallpapers.id')
      .onUpdate('restrict')
      .onDelete('restrict');

    table.foreign('user_id')
      .references('users.id')
      .onUpdate('cascade')
      .onDelete('restrict');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('featured_wallpapers');
};
