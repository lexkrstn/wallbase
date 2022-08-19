/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('wallpapers', table => {
    table.uuid('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.bigInteger('uploader_id').unsigned().notNullable();
    table.string('mimetype', 64).notNullable();
    table.string('ext', 8).notNullable();
    table.integer('file_size').unsigned().notNullable();
    table.integer('width').unsigned().notNullable();
    table.integer('height').unsigned().notNullable();
    table.string('source_url').notNullable().defaultTo('');
    table.string('author_name').notNullable().defaultTo('');
    table.string('author_url').notNullable().defaultTo('');
    table.integer('tag_count').unsigned().notNullable().defaultTo(0);
    table.integer('view_count').unsigned().notNullable().defaultTo(0);
    table.integer('fav_count').unsigned().notNullable().defaultTo(0);
    table.integer('fav_count_1d').unsigned().notNullable().defaultTo(0);
    table.integer('fav_count_1w').unsigned().notNullable().defaultTo(0);
    table.integer('fav_count_1m').unsigned().notNullable().defaultTo(0);
    table.integer('purity').notNullable().defaultTo(1);
    table.integer('board').notNullable().defaultTo(1);
    table.float('ratio').notNullable().comment('width / height');
    table.specificType('tsv', 'tsvector').nullable()
      .comment('Concatenated FT-search data of all tags');
    table.specificType('rgb4x4', 'float[48]').notNullable()
      .comment('4x4 rgb data to search for similars');
    table.specificType('colors', 'float[15]').notNullable()
      .comment('5 distinctive colors');
    table.specificType('avg_color', 'float[3]').notNullable();
    table.string('sha256', 64).notNullable();
    table.boolean('featured').notNullable().defaultTo(false);

    table.foreign('uploader_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

  await knex.schema.raw(`
    CREATE FUNCTION on_wallpaper_insert_delete_update_user() RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE users
          SET upload_count = upload_count + 1
          WHERE id = NEW.uploader_id;
        RETURN NEW;
      ELSE
        UPDATE categories
          SET upload_count = upload_count - 1
          WHERE id = OLD.uploader_id;
        RETURN OLD;
      END IF;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_wallpaper_insert_delete_update_user
      AFTER INSERT OR DELETE
      ON wallpapers
      FOR EACH ROW EXECUTE PROCEDURE on_wallpaper_insert_delete_update_user();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('wallpapers');
  await knex.raw('DROP FUNCTION IF EXISTS on_wallpaper_insert_delete_update_user');
};
