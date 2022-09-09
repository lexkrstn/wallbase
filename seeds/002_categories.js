/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('categories').insert([
    {
      id: 72,
      name: 'Persons',
      creator_id: 1,
      parent_id: 1
    },
    {
      id: 71,
      name: 'Architecture',
      creator_id: 1,
      parent_id: 75
    },
    {
      id: 84,
      name: 'Sports',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 85,
      name: 'Military & Weapon',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 86,
      name: 'Religion',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 87,
      name: 'Science',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 88,
      name: 'Quotes',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 89,
      name: 'Location',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 90,
      name: 'Cities',
      creator_id: 1,
      parent_id: 89
    },
    {
      id: 91,
      name: 'Countries',
      creator_id: 1,
      parent_id: 89
    },
    {
      id: 92,
      name: 'Space',
      creator_id: 1,
      parent_id: 89
    },
    {
      id: 93,
      name: 'Companies & Logos',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 69,
      name: 'Vehicles',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 94,
      name: 'Food',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 95,
      name: 'Colors',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 74,
      name: 'Animals',
      creator_id: 1,
      parent_id: 5
    },
    {
      id: 3,
      name: 'Hentai \/ Ecchi',
      creator_id: 1,
      parent_id: 2
    },
    {
      id: 97,
      name: 'Flora / Plants / Trees',
      creator_id: 1,
      parent_id: 5
    },
    {
      id: 98,
      name: 'Aircraft',
      creator_id: 1,
      parent_id: 69
    },
    {
      id: 100,
      name: 'Ships',
      creator_id: 1,
      parent_id: 69
    },
    {
      id: 2,
      name: 'Anime \/ Manga',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 101,
      name: 'Spacecrafts',
      creator_id: 1,
      parent_id: 69
    },
    {
      id: 102,
      name: 'Trains',
      creator_id: 1,
      parent_id: 69
    },
    {
      id: 77,
      name: 'Entertainment',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 79,
      name: 'Humor',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 80,
      name: 'Movies',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 81,
      name: 'Music',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 76,
      name: 'Cartoons \/ Comics',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 96,
      name: 'Miscellaneous',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 5,
      name: 'Nature',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 70,
      name: 'Landscapes',
      creator_id: 1,
      parent_id: 5
    },
    {
      id: 73,
      name: 'Body Parts',
      creator_id: 1,
      parent_id: 1
    },
    {
      id: 99,
      name: 'Cars & Motorcycles',
      creator_id: 1,
      parent_id: 69
    },
    {
      id: 1,
      name: 'People',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 83,
      name: 'Clothing',
      creator_id: 1,
      parent_id: 1
    },
    {
      id: 78,
      name: 'Games',
      creator_id: 1,
      parent_id: 77
    },
    {
      id: 75,
      name: 'Art \/ Design',
      creator_id: 1,
      parent_id: null
    },
    {
      id: 103,
      name: 'Photography',
      creator_id: 1,
      parent_id: 75
    },
  ]);
};
