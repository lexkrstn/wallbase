/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = async function(knex) {
  await knex.schema.createTable('collections_wallapers', table => {
    table.bigInteger('collection_id').unsigned().notNullable();
    table.uuid('wallpaper_id').notNullable().index();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['collection_id', 'wallpaper_id']);

    table.foreign('collection_id')
      .references('collections.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.foreign('wallpaper_id')
      .references('wallpapers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });

  await knex.schema.raw(`
    CREATE FUNCTION on_collection_wallpapers_change() RETURNS trigger AS $$
    DECLARE
      affected_row RECORD;
      user_id bigint;
      inc int;
    BEGIN
      affected_row := (
        CASE
          WHEN TG_OP = 'INSERT' THEN NEW
          ELSE OLD
        END
      );
      inc := (
        CASE
          WHEN TG_OP = 'INSERT' THEN 1
          ELSE -1
        END
      );
      user_id := (
        SELECT uploader_id
          FROM wallpapers
          WHERE id = affeected_row.wallpaper_id
      );
      UPDATE users
        SET fav_count = fav_count + inc
        WHERE id = user_id;
      UPDATE collections
        SET wallpaper_count = wallpaper_count + inc
        WHERE id = affected_row.collection_id;
      UPDATE wallpapers
        SET
          fav_count = fav_count + inc,
          fav_count_1d = fav_count_1d + inc,
          fav_count_1w = fav_count_1w + inc,
          fav_count_1m = fav_count_1m + inc
        WHERE id = affected_row.wallpaper_id;
      RETURN affected_row;
    END
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER on_collection_wallpapers_change
      AFTER INSERT OR DELETE
      ON collections_wallapers
      FOR EACH ROW EXECUTE PROCEDURE on_collection_wallpapers_change();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('collections_wallapers');
  await knex.raw('DROP FUNCTION IF EXISTS on_collection_wallpapers_change');
};
