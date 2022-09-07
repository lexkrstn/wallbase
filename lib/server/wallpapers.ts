import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import FeaturedWallpaperSlide from '@/entities/featured-wallpaper-slide';
import Wallpaper, { getWallpaperFileName } from '@/entities/wallpaper';
import Tag from '@/entities/tag';
import { OrderByType } from '@/lib/types';
import config from '@/lib/server/config';
import { getFileHash } from '@/lib/server/hash';
import knex from '@/lib/server/knex';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@/lib/helpers/object-keys';
import {
  createThumbnail, getAvgColorOfRgbPixels, getImage4x4Pixels,
  getImageDistinctiveColors, getImageSize,
} from '@/lib/server/image';
import { DEFAULT_SEARCH_OPTIONS, SearchOptions } from '@/lib/search-options';
import { MIMETYPE_TO_EXT } from '@/lib/constants';
import { findTagsById } from '@/lib//server/tags';
import { UniqueViolationError, wrapError } from 'db-errors';

function camelCaseWallpaperKeys(obj: Record<any, any>): Record<any, any> {
  return {
    ...camelCaseObjectKeys(omit(obj, ['rgb4x4', 'sha256'])),
    ...pick(obj, ['rgb4x4', 'sha256']),
  };
}

function snakeCaseWallpaperKeys(obj: Record<any, any>): Record<any, any> {
  return {
    ...snakeCaseObjectKeys(omit(obj, ['rgb4x4', 'sha256'])),
    ...pick(obj, ['rgb4x4', 'sha256']),
  };
}

/**
 * Type-unsafe covereter of DB records to Wallpapers.
 */
function dbRowToWallpaper(row: Record<string, unknown>) {
  return {
    ...camelCaseWallpaperKeys(omit(row, ['rank'])),
    tags: [] as Tag[],
  } as Wallpaper;
}

export async function getFeaturedWallpaperSlides(): Promise<FeaturedWallpaperSlide[]> {
  return [
    {
      image: 'https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg',
      href: `/walls/1`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/x8/wallhaven-x8rwzo.jpg',
      href: `/walls/2`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/j3/wallhaven-j3glxy.jpg',
      href: `/walls/3`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/wq/wallhaven-wq9v8p.jpg',
      href: `/walls/4`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/28/wallhaven-2879mg.png',
      href: `/walls/5`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/g7/wallhaven-g7yv8q.jpg',
      href: `/walls/6`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/rd/wallhaven-rdm6km.png',
      href: `/walls/7`,
      description: 'Blah',
    },
  ];
}

type CreateWallpaperDto = Omit<Wallpaper,
  'createdAt' | 'updatedAt' | 'tagCount' | 'viewCount' | 'favCount' |
  'favCount1d' | 'favCount1w' | 'favCount1m' | 'featured' | 'tags'
>;

/**
 * Inserts a wallpaper record into the DB.
 */
export async function insertWallpaper(dto: CreateWallpaperDto): Promise<Wallpaper> {
  const [row] = await knex('wallpapers')
    .insert(snakeCaseWallpaperKeys(dto))
    .returning('*');
  return dbRowToWallpaper(row);
}

/**
 * Returns the absolute path of the wallpaper file by its ID and mimetype.
 */
function getWallpaperPath(id: string, mimetype: string): string {
  return path.join(config.wallpaper.path, getWallpaperFileName(id, mimetype));
}

/**
 * Returns the absolute path of the wallpaper's thumbnail file by its ID and mimetype.
 */
function getThumbnailPath(id: string, mimetype: string): string {
  return path.join(config.thumbnail.path, getWallpaperFileName(id, mimetype));
}

/**
 * Searches for the wallpaper already registered in DB, whose file is fully
 * identical the given one.
 */
async function findIdenticalWallpaperByFile(
  filePath: string,
  sha256: string,
): Promise<Wallpaper | null> {
  const rows = await knex('wallpapers').where({ sha256 });
  const wallpapers = rows.map(dbRowToWallpaper);
  const file = await fs.readFile(filePath);
  for (const wallpaper of wallpapers) {
    const file2 = await fs.readFile(getWallpaperPath(wallpaper.id, wallpaper.mimetype));
    if (file.equals(file2)) {
      return wallpaper;
    }
  }
  return null;
}

export class DuplicateWallpaperError extends Error {
  public constructor(public id: string) {
    super('This image is already on the site');
    Error.captureStackTrace(this);
  }
}

interface UploadWallpaperDto {
  path: string;
  mimetype: string;
  fileSize: number;
  purity: number;
  board: number;
  uploaderId: string;
  sourceUrl?: string;
  authorUrl?: string;
  authorName?: string;
}

/**
 * Processes the specified (user-uploaded) image file, inserts it in DB and
 * returns a newly created Wallpaper record which represents it.
 */
export async function uploadWallpaper({
  path,
  mimetype,
  fileSize,
  uploaderId,
  purity,
  board,
  sourceUrl = '',
  authorUrl = '',
  authorName = '',
}: UploadWallpaperDto): Promise<Wallpaper> {
  const sha256 = await getFileHash(path, 'sha256');
  const duplicate = await findIdenticalWallpaperByFile(path, sha256);
  if (duplicate) {
    throw new DuplicateWallpaperError(duplicate.id);
  }
  const id = uuidv4();
  const thumbPath = getThumbnailPath(id, mimetype);
  const thumbWidth = config.thumbnail.width;
  const thumbHeight = config.thumbnail.height;
  const { width, height } = await getImageSize(path);
  await createThumbnail(path, width, height, thumbPath, thumbWidth, thumbHeight);
  const colors = await getImageDistinctiveColors(thumbPath, thumbWidth, thumbHeight);
  const rgb4x4 = await getImage4x4Pixels(thumbPath);
  const avgColor = await getAvgColorOfRgbPixels(rgb4x4);
  await fs.rename(path, getWallpaperPath(id, mimetype));
  return await insertWallpaper({
    id,
    uploaderId,
    mimetype,
    fileSize,
    sha256,
    ext: MIMETYPE_TO_EXT[mimetype],
    purity,
    board,
    sourceUrl,
    authorName,
    authorUrl,
    width,
    height,
    ratio: width / height,
    colors,
    rgb4x4,
    avgColor,
  });
}

interface FindWallpapersOptions {
  withTags?: boolean;
}

/**
 * Searches for the wallpapers in DB by search options.
 */
export async function findWallpapers(
  so: Partial<SearchOptions>,
  { withTags = false }: FindWallpapersOptions = {},
) {
  const qb = knex('wallpapers');

  // filter by boards
  if (so.boards) {
    qb.whereRaw('board & ? = board', [so.boards]);
  }
  // filter by purity
  if (so.purity) {
    qb.whereRaw('purity & ? = purity', [so.purity]);
  }
  // filter by query
  const query = so.query?.trim();
  if (query) {
    qb.select(knex.raw(
      '*, ts_rank(tsv, plainto_tsquery(\'english\', ?)) as rank',
      [query],
    ));
    qb.whereRaw('tsv @@ plainto_tsquery(\'english\', ?)', [query]);
  }
  // filter by ratio
  if (so.aspect) {
    const aspect = parseFloat(so.aspect);
    if (aspect >= 2.4999) {
      qb.where('aspect', '>=', 2.5);
    } else if (aspect >= 0.9999) {
      qb.whereBetween('aspect', [aspect - 0.0001, aspect + 0.0001]);
    } else {
      qb.where('aspect', '<', 1);
    }
  }
  // filter by resolution
  if (so.resolution) {
    const op = so.resolutionOp === 'eq' ? '=' : '>=';
    const resolution = so.resolution.split('x').map(x => parseInt(x, 10));
    if (resolution.length !== 2 || Number.isNaN(resolution[0]) || Number.isNaN(resolution[1])) {
      throw new Error('Resolution misformatted');
    }
    qb.whereRaw(`width ${op} ? AND height ${op} ?`, resolution);
  }

  const [{ count }] = await qb.clone().count();

  // sort order
  const orderBy = so.orderBy ?? DEFAULT_SEARCH_OPTIONS.orderBy;
  const orderByToColumn: Record<OrderByType, string> = {
    relevancy: query && orderBy === 'relevancy' ? 'rank' : 'fav_count_1w',
    date: 'created_at',
    views: 'view_count',
    favs: 'fav_count',
  };
  qb.orderBy(orderByToColumn[orderBy], so.order ?? DEFAULT_SEARCH_OPTIONS.order);
  // pagination
  const pageSize = so.pageSize ?? DEFAULT_SEARCH_OPTIONS.pageSize;
  qb.limit(pageSize);
  if (so.page) {
    qb.offset((so.page - 1) * pageSize);
  }

  const wallpapers = (await qb).map(dbRowToWallpaper);

  return {
    wallpapers: withTags ? await injectWallpaperTags(wallpapers) : wallpapers,
    totalCount: parseInt(count + '', 10),
  };
}

interface WallpapersTagsRow {
  wallpaper_id: string;
  tag_id: string;
}

/**
 * Loads tags for the wallpapers and returns a copy of the array of wallpapers
 * which have tags array filled up.
 */
export async function injectWallpaperTags(wallpapers: Wallpaper[]): Promise<Wallpaper[]> {
  if (wallpapers.length === 0) return [];

  const pivotRows = await knex<WallpapersTagsRow>('wallpapers_tags')
    .whereIn('wallpaper_id', wallpapers.map(w => w.id));

  let tags: Tag[] = [];
  if (pivotRows.length > 0) {
    tags = await findTagsById(uniq(pivotRows.map(row => row.tag_id)));
  }

  return wallpapers.map(wallpaper => {
    const tagIds = pivotRows
      .filter(row => row.wallpaper_id === wallpaper.id)
      .map(row => row.tag_id);
    return {
      ...wallpaper,
      tags: tags.filter(tag => tagIds.includes(tag.id)),
    };
  });
}

/**
 * Adds tags to the wallpaper in DB.
 */
export async function addWallpaperTags(
  wallpaperId: string,
  tagIds: string[],
  creatorId: string,
) {
  const promises = tagIds.map(async tagId => {
    try {
      await knex('wallpapers_tags').insert({
        wallpaper_id: wallpaperId,
        tag_id: tagId,
        creator_id: creatorId,
      });
    } catch (err: any) {
      if (!(wrapError(err) instanceof UniqueViolationError)) throw err;
      // Skip UniqueViolationError
    }
  });
  return Promise.all(promises);
}

interface FindWallpaperByIdOptions {
  withTags?: boolean;
}

/**
 * Resolves the promise with the wallpaper found (or null if nothing found).
 */
export async function findWallpaperById(id: string, options: FindWallpaperByIdOptions = {}) {
  const wallpapers = await findWallpapersById([id], options);
  return wallpapers.length > 0 ? wallpapers[0] : null;
}

/**
 * Resolves a promise with the wallpapers found.
 */
export async function findWallpapersById(ids: string[], {
  withTags,
}: FindWallpaperByIdOptions = {}) {
  if (ids.length === 0) return [];
  const qb = knex('wallpapers');
  if (ids.length === 1) {
    qb.where('id', ids[0]);
  } else {
    qb.whereIn('id', ids);
  }
  const rows = await qb;
  if (rows.length === 0) return [];
  let wallpapers = rows.map(dbRowToWallpaper);
  if (withTags) {
    wallpapers = await injectWallpaperTags(wallpapers);
  }
  return wallpapers;
}

/**
 * Deletes the wallpaper from DB and removes all the files.
 */
export async function deleteWallpaper(wallpaper: Wallpaper) {
  await knex('wallpapers')
    .where('id', wallpaper.id)
    .delete();
  await fs.unlink(getWallpaperPath(wallpaper.id, wallpaper.mimetype));
  await fs.unlink(getThumbnailPath(wallpaper.id, wallpaper.mimetype));
}
