import knex from '@/lib/server/knex';
import os from 'os';
import checkDiskSpace from 'check-disk-space';
import config from './config';

export interface Statistics {
  totalWallpapers: number;
  generalWallpapers: number;
  animeWallpapers: number;
  peopleWallpapers: number;
  wallpapersAdded24h: number;
  totalUsers: number;
  newUsers24h: number;
  totalTags: number;
  favoritedWallpapers: number;
  totalFavorites: number;
  usersOnline: number;
  wallpapersFileSize: number;
  diskSize: number;
  diskFreeSpace: number;
  osFreeMemory: number;
  osTotalMemory: number;
  appMemory: number;
}

export async function getStatistics(): Promise<Statistics> {
  const wallCounts = await knex('wallpapers')
    .select('board', knex.raw('count(*)'))
    .groupBy('board')
    .count();
  const wallCountMap = wallCounts
    .reduce<Record<string, number>>((obj, { board, count }) => ({
      ...obj,
      [board]: parseInt(count + '', 10),
    }), {});
  const generalWallpapers = wallCountMap['general'] || 0;
  const animeWallpapers = wallCountMap['anime'] || 0;
  const peopleWallpapers = wallCountMap['people'] || 0;
  const [{ count: wallpapersAdded24h }] = await knex('wallpapers')
    .where('created_at', '>', knex.raw('NOW() - INTERVAL \'1 DAY\''))
    .count();
  const [{ count: totalUsers }] = await knex('users').count();
  const [{ count: newUsers24h }] = await knex('users')
    .where('created_at', '>', knex.raw('NOW() - INTERVAL \'1 DAY\''))
    .count();
  const [{ count: totalTags }] = await knex('tags').count();
  const [{ count: favoritedWallpapers }] = await knex('collections_wallapers')
    .countDistinct('wallpaper_id');
  const [{ count: totalFavorites }] = await knex('collections_wallapers').count();
  const [{ count: usersOnline }] = await knex('users')
    .where('visited_at', '>', knex.raw('NOW() - INTERVAL \'1 HOUR\''))
    .count();
  const [{ s: wallpapersFileSize }] = await knex('wallpapers')
    .select(knex.raw('SUM(file_size) as s'));
  const diskStats = await checkDiskSpace(config.wallpaper.path);
  const { heapTotal: appMemory } = process.memoryUsage();

  return {
    totalWallpapers: generalWallpapers + animeWallpapers + peopleWallpapers,
    generalWallpapers,
    animeWallpapers,
    peopleWallpapers,
    wallpapersAdded24h: parseInt(wallpapersAdded24h + '', 10),
    totalUsers: parseInt(totalUsers + '', 10),
    newUsers24h: parseInt(newUsers24h + '', 10),
    totalTags: parseInt(totalTags + '', 10),
    favoritedWallpapers: parseInt(favoritedWallpapers + '', 10),
    totalFavorites: parseInt(totalFavorites + '', 10),
    usersOnline: parseInt(usersOnline + '', 10),
    wallpapersFileSize: parseInt(wallpapersFileSize + '', 10) || 0,
    diskSize: diskStats.size,
    diskFreeSpace: diskStats.free,
    osFreeMemory: os.freemem(),
    osTotalMemory: os.totalmem(),
    appMemory,
  };
}
