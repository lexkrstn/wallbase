import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('tags').insert([
    {
      id: 62,
      name: 'portrait',
      creator_id: 1,
      category_id: 103,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 31,
      name: 'short hair',
      creator_id: 1,
      category_id: 73,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 18,
      name: 'lingerie',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: '',
    },
    {
      id: 30,
      name: 'long hair',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 34,
      name: 'arched back',
      creator_id: 1,
      category_id: 73,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 37,
      name: 'thongs',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: '',
    },
    {
      id: 29,
      name: 'thighs',
      creator_id: 1,
      category_id: 73,
      purity: 'sketchy',
      alias: '',
    },
    {
      id: 35,
      name: 'ass',
      creator_id: 1,
      category_id: 73,
      purity: 'sketchy',
      alias: 'asses, bum, butt, butts, buttocks',
    },
    {
      id: 16,
      name: 'anime girls',
      creator_id: 1,
      category_id: 2,
      purity: 'sfw',
      alias: 'manga girls',
    },
    {
      id: 36,
      name: 'back',
      creator_id: 1,
      category_id: 73,
      purity: 'sfw',
      alias: 'backs',
    },
    {
      id: 23,
      name: 'bent over',
      creator_id: 1,
      category_id: 1,
      purity: 'sketchy',
      alias: 'ass up, ass up face down, bend over, butt up, doggy, doggy style, doggystyle, face down, face down ass up, on all fours, on hands and knees',
    },
    {
      id: 24,
      name: 'blonde',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'blonde hair, blondes',
    },
    {
      id: 26,
      name: 'knee-highs',
      creator_id: 1,
      category_id: 83,
      purity: 'sfw',
      alias: 'high socks, knee-high socks, knee highs, kneehighs, knee high socks, kneehigh socks, knee socks, kneesocks',
    },
    {
      id: 39,
      name: 'dyed hair',
      creator_id: 1,
      category_id: 73,
      purity: 'sfw',
      alias: 'hair dye',
    },
    {
      id: 32,
      name: 'panties',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: 'pantsu, panty',
    },
    {
      id: 20,
      name: 'panties down',
      creator_id: 1,
      category_id: 83,
      purity: 'nsfw',
      alias: 'pulling down panties',
    },
    {
      id: 22,
      name: 'removing panties',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: 'undressing',
    },
    {
      id: 21,
      name: 'shaved vagina',
      creator_id: 1,
      category_id: 73,
      purity: 'nsfw',
      alias: 'shaved pussies, shaved pussy, shaved vaginas',
    },
    {
      id: 28,
      name: 'sideboob',
      creator_id: 1,
      category_id: 1,
      purity: 'sketchy',
      alias: 'side boob, sideboobs, side boobs',
    },
    {
      id: 27,
      name: 'smiling',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'smile, smiles',
    },
    {
      id: 33,
      name: 'striped panties',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: 'shimapan, striped underwear',
    },
    {
      id: 25,
      name: 'tatoo',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'tattooed, tattoos',
    },
    {
      id: 45,
      name: 'shoes',
      creator_id: 1,
      category_id: 83,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 15,
      name: 'women',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'babes, woman, female, girls, lady',
    },
    {
      id: 38,
      name: 'nude',
      creator_id: 1,
      category_id: 1,
      purity: 'nsfw',
      alias: 'naked, nudes',
    },
    {
      id: 40,
      name: 'asian',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'asians',
    },
    {
      id: 41,
      name: 'curve women',
      creator_id: 1,
      category_id: 1,
      purity: 'sketchy',
      alias: 'curvaceous, curves, curvy bodies, curvy body, feminine bodies, juicy, juicy women, sexy bodies, sexy body, voluptuous',
    },
    {
      id: 42,
      name: 'boobs',
      creator_id: 1,
      category_id: 73,
      purity: 'nsfw',
      alias: 'boob, boobies, breast, breasts, tits, titties, titts',
    },
    {
      id: 43,
      name: 'nipples',
      creator_id: 1,
      category_id: 73,
      purity: 'nsfw',
      alias: 'nippels, nipple',
    },
    {
      id: 44,
      name: 'bathtubs',
      creator_id: 1,
      category_id: 96,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 46,
      name: 'strategic covering',
      creator_id: 1,
      category_id: 1,
      purity: 'sketchy',
      alias: '',
    },
    {
      id: 47,
      name: 'in bed',
      creator_id: 1,
      category_id: 1,
      purity: 'sketchy',
      alias: 'lying in bed, lying on bed',
    },
    {
      id: 48,
      name: 'small boobs',
      creator_id: 1,
      category_id: 73,
      purity: 'nsfw',
      alias: 'flat chest, flat chested, pettanko, small breasts',
    },
    {
      id: 49,
      name: 'rock',
      creator_id: 1,
      category_id: 5,
      purity: 'sfw',
      alias: 'rocks, rocky',
    },
    {
      id: 50,
      name: 'looking down',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 51,
      name: 'river',
      creator_id: 1,
      category_id: 70,
      purity: 'sfw',
      alias: 'rivers, stream, streams',
    },
    {
      id: 53,
      name: 'bra',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: 'bras, brassiere',
    },
    {
      id: 54,
      name: 'bikini',
      creator_id: 1,
      category_id: 83,
      purity: 'sketchy',
      alias: 'bikini bottom, bikinis',
    },
    {
      id: 52,
      name: 'wet body',
      creator_id: 1,
      category_id: 73,
      purity: 'sketchy',
      alias: 'wet ass, wet asses, wet belly, wet bodies, wet boob, wet boobs, wet breast, wet breasts, wet chest, wet pussies, wet pussy, wet stomach, wet vaginas',
    },
    {
      id: 55,
      name: 'flat belly',
      creator_id: 1,
      category_id: 73,
      purity: 'sketchy',
      alias: 'flat bellies, flat stomach, flat stomachs, flat tummies, flat tummy',
    },
    {
      id: 56,
      name: 'car',
      creator_id: 1,
      category_id: 99,
      purity: 'sfw',
      alias: 'cars',
    },
    {
      id: 57,
      name: 'women with glasses',
      creator_id: 1,
      category_id: 1,
      purity: 'sfw',
      alias: 'girls with glasses, girl with glasses, woman with glasses',
    },
    {
      id: 58,
      name: 'glasses',
      creator_id: 1,
      category_id: 83,
      purity: 'sfw',
      alias: '',
    },
    {
      id: 59,
      name: 'digital art',
      creator_id: 1,
      category_id: 75,
      purity: 'sfw',
      alias: 'Cgi, digital artwork, digital compositions, graphic, graphics',
    },
    {
      id: 60,
      name: 'video games',
      creator_id: 1,
      category_id: 78,
      purity: 'sfw',
      alias: 'game, game art, games, gaming, video game, videogame, videogames, video games art',
    },
    {
      id: 61,
      name: 'pixel art',
      creator_id: 1,
      category_id: 75,
      purity: 'sfw',
      alias: 'bit art, pixel, pixelart, pixelated',
    },
  ]);
};
