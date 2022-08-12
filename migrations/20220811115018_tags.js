/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('tags', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.string('name', 255).notNullable();
    table.string('alias', 255).notNullable().defaultTo('')
      .comment('Comma separated aliases to search by');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.bigInteger('creator_id').unsigned().notNullable();
    table.bigInteger('category_id').unsigned().nullable();
    table.string('description', 1024).notNullable().defaultTo('');
    table.integer('wallpaper_count').unsigned().notNullable().defaultTo(0);
    table.integer('fav_count').unsigned().notNullable().defaultTo(0);
    table.enum('purity', ['sfw', 'sketchy', 'nsfw']).notNullable().defaultTo('sfw');
    table.specificType('tsv', 'tsvector').nullable()
      .comment('Full text search vector containing name and alias');

    table.foreign('creator_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('category_id')
      .references('categories.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

  await knex.schema.raw(`
		CREATE FUNCTION on_tag_insert_update_update_tag_tsv() RETURNS trigger AS $$
		BEGIN
			new.tsv :=
				setweight(to_tsvector(new.name), 'A') ||
				setweight(to_tsvector(new.alias), 'B');
			return new;
		END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_tag_insert_update_update_tag_tsv BEFORE INSERT OR UPDATE ON tags
      FOR EACH ROW EXECUTE PROCEDURE on_tag_insert_update_update_tag_tsv();

    CREATE FUNCTION on_insert_delete_tag() RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE categories
          SET tag_count = tag_count + 1
          WHERE id = NEW.category_id;
        UPDATE users
          SET created_tag_count = created_tag_count + 1
          WHERE id = NEW.creator_id;
        RETURN NEW;
      ELSE
        UPDATE categories
          SET tag_count = tag_count - 1
          WHERE id = OLD.category_id;
        UPDATE users
          SET created_tag_count = created_tag_count - 1
          WHERE id = OLD.creator_id;
        RETURN OLD;
      END IF;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_insert_delete_tag AFTER INSERT OR DELETE ON tags
      FOR EACH ROW EXECUTE PROCEDURE on_insert_delete_tag();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('tags');
  await knex.raw('DROP FUNCTION IF EXISTS on_tag_insert_update_update_tag_tsv');
  await knex.raw('DROP FUNCTION IF EXISTS on_insert_delete_tag');
};
