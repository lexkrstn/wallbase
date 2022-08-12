/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('comments', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.bigInteger('author_id').unsigned().notNullable().index();
    table.text('message').notNullable();

    table.foreign('author_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

  await knex.schema.raw(`
    CREATE FUNCTION on_comment_insert_delete_update_user() RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE users
          SET comment_count = comment_count + 1
          WHERE id = NEW.author_id;
        RETURN NEW;
      ELSE
        UPDATE categories
          SET comment_count = comment_count - 1
          WHERE id = OLD.author_id;
        RETURN OLD;
      END IF;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_comment_insert_delete_update_user
      AFTER INSERT OR DELETE
      ON comments
      FOR EACH ROW EXECUTE PROCEDURE on_comment_insert_delete_update_user();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('comments');
  await knex.raw('DROP FUNCTION IF EXISTS on_comment_insert_delete_update_user');
};
