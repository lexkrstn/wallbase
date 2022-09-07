/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('wallpapers_tags', table => {
    table.uuid('wallpaper_id').notNullable();
    table.bigInteger('tag_id').unsigned().notNullable().index();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.bigInteger('creator_id').unsigned().notNullable().index();

    table.primary(['wallpaper_id', 'tag_id']);

    table.foreign('wallpaper_id')
      .references('wallpapers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('tag_id')
      .references('tags.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('creator_id')
      .references('users.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

  await knex.schema.raw(`
    CREATE FUNCTION concat_tsvectors(tsv1 tsvector, tsv2 tsvector)
      RETURNS tsvector AS $$
    BEGIN
      RETURN coalesce(tsv1, to_tsvector(''))
        || coalesce(tsv2, to_tsvector(''));
    END;
    $$ LANGUAGE plpgsql;

    CREATE AGGREGATE concat_tsvectors (
      BASETYPE = tsvector,
      SFUNC = concat_tsvectors,
      STYPE = tsvector,
      INITCOND = ''
    );
  `);

  await knex.schema.raw(`
    CREATE FUNCTION update_wallpaper_tsv(UUID) RETURNS void AS $$
    BEGIN
      UPDATE wallpapers
        SET tsv = (
          SELECT concat_tsvectors(t.tsv)
            FROM tags AS t
            WHERE t.id IN (
              SELECT wt.tag_id
                FROM wallpapers_tags AS wt
                WHERE wt.wallpaper_id = $1
            )
        )
        WHERE id = $1;
    END
    $$ LANGUAGE plpgsql;

    CREATE FUNCTION on_tag_attach_detach() RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        PERFORM update_wallpaper_tsv(NEW.wallpaper_id);
        UPDATE wallpapers
          SET tag_count = tag_count + 1
          WHERE id = NEW.wallpaper_id;
        UPDATE tags
          SET wallpaper_count = wallpaper_count + 1
          WHERE id = NEW.tag_id;
        UPDATE users
          SET attached_tag_count = attached_tag_count + 1
          WHERE id = (
            SELECT uploader_id FROM wallpapers WHERE id = NEW.wallpaper_id
          );
        RETURN NEW;
      ELSE
        PERFORM update_wallpaper_tsv(OLD.wallpaper_id);
        UPDATE wallpapers
          SET tag_count = tag_count - 1
          WHERE id = OLD.wallpaper_id;
        UPDATE tags
          SET wallpaper_count = wallpaper_count - 1
          WHERE id = OLD.tag_id;
        UPDATE users
          SET attached_tag_count = attached_tag_count - 1
          WHERE id = (
            SELECT uploader_id FROM wallpapers WHERE id = OLD.wallpaper_id
          );
        RETURN OLD;
      END IF;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_tag_attach_detach AFTER INSERT OR DELETE ON wallpapers_tags
      FOR EACH ROW EXECUTE PROCEDURE on_tag_attach_detach();
  `);

  await knex.schema.raw(`
    CREATE FUNCTION on_update_tag_update_wallpaper_tsv() RETURNS trigger AS $$
    BEGIN
      UPDATE wallpapers as w
        SET tsv = (
          SELECT concat_tsvectors(t.tsv)
            FROM tags AS t
            WHERE t.id IN (
              SELECT wt.tag_id
                FROM wallpapers_tags AS wt
                WHERE wt.wallpaper_id = w.id
            )
        )
        WHERE id IN (
          SELECT wt1.wallpaper_id
            FROM wallpapers_tags AS wt1
            WHERE wt1.tag_id = NEW.id
        );
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_update_tag_update_wallpaper_tsv AFTER UPDATE ON tags
      FOR EACH ROW EXECUTE PROCEDURE on_update_tag_update_wallpaper_tsv();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS on_update_tag_update_wallpaper_tsv ON tags');
  await knex.raw('DROP FUNCTION IF EXISTS on_update_tag_update_wallpaper_tsv');
  await knex.schema.dropTableIfExists('wallpapers_tags');
  await knex.raw('DROP FUNCTION IF EXISTS on_attach_tag_update_wallpaper_tsv');
  await knex.raw('DROP FUNCTION IF EXISTS on_tag_attach_detach');
  await knex.raw('DROP FUNCTION IF EXISTS update_wallpaper_tsv');
  await knex.raw('DROP AGGREGATE IF EXISTS concat_tsvectors(tsvector)');
  await knex.raw('DROP FUNCTION IF EXISTS concat_tsvectors');
};
