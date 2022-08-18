/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.bigIncrements('id').unsigned().notNullable().primary();
    table.string('login', 255).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.boolean('activated').notNullable().defaultTo(false);
    table.string('password_hash', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('visited_at').defaultTo(knex.fn.now());
    table.string('last_ip', 45).notNullable().defaultTo('127.0.0.1');
    table.integer('collection_count').notNullable().defaultTo(0)
      .comment('number of wallpapers the user has favorited');
    table.integer('avatar_version').notNullable().defaultTo(1);
    table.string('avatar_ext', 3).notNullable().defaultTo('');
    table.string('cc2', 2).notNullable().defaultTo('')
      .comment('ISO 3166-1 alpha-2 country code');
    table.string('cc3', 3).notNullable().defaultTo('')
      .comment('ISO 3166-1 alpha-3 country code');
    table.string('country', 127).notNullable().defaultTo('')
      .comment('country name');
    table.string('city', 32).notNullable().defaultTo('');
    table.string('timezone', 64).notNullable().defaultTo('');
    table.float('lat').nullable();
    table.float('lng').nullable();
    table.integer('upload_count').notNullable().defaultTo(0)
      .comment('number of uploaded wallpapers curretlly listed on website');
    table.integer('rating').notNullable().defaultTo(0)
      .comment('uploading wallpapers, editing tags, getting achievements enhances user score');
    table.integer('wall_view_count').notNullable().defaultTo(0)
      .comment('number of times the user viewed wallpapers');
    table.enum('role', ['banned', 'viewer', 'uploader', 'moderator', 'admin'])
      .notNullable().defaultTo('uploader');
    table.integer('upload_fav_count').notNullable().defaultTo(0)
      .comment('how many times the uploads of this user have been favourited');
    table.integer('fav_count').notNullable().defaultTo(0)
      .comment('how many times the uploads of this user have been favourited');
    table.integer('created_tag_count').notNullable().defaultTo(0);
    table.integer('attached_tag_count').notNullable().defaultTo(0);
    table.integer('comment_count').notNullable().defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
};
