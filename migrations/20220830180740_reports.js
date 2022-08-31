/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('reports', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.uuid('wallpaper_id').notNullable().index();
    table.bigInteger('user_id').notNullable().index();
    table.string('type', 64).notNullable().defaultTo('')
      .comment('low_quality|duplicate|rule|copyright|illegal|other');
    table.uuid('duplicate_id').nullable().index();
    table.string('message').notNullable().defaultTo('');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.boolean('reviewed').notNullable().defaultTo(false)
      .comment('Reviewed, but left in the table to prevent further reports of this type');

    table.unique(['wallpaper_id', 'type']);

    table.foreign('wallpaper_id')
      .references('wallpapers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('duplicate_id')
      .references('wallpapers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('user_id')
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
  await knex.schema.dropTableIfExists('reports');
};
