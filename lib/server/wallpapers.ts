import { UniqueViolationError, wrapError } from 'db-errors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import Wallpaper, { getWallpaperFileName } from '@/entities/wallpaper';
import FeaturedWallpaper from '@/entities/featured-wallpaper';
import Tag from '@/entities/tag';
import { OrderByType } from '@/lib/types';
import config from '@/lib/server/config';
import { getFileHash } from '@/lib/server/hash';
import knex from '@/lib/server/knex';
import {
  FEATURED_WALLPAPER_COUNT, FEATURED_WALLPAPER_HEIGHT, FEATURED_WALLPAPER_WIDTH, MIMETYPE_TO_EXT,
} from '@/lib/constants';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@/lib/helpers/object-keys';
import {
  createThumbnail, getAvgColorOfRgbPixels, getImageSimdata,
  getImageDistinctiveColors, getImageSize,
} from '@/lib/server/image';
import { DEFAULT_SEARCH_OPTIONS, SearchOptions } from '@/lib/search-options';
import { findTagsByWallpaperIds } from '@/lib//server/tags';
import { FeaturedWallpaperRow } from './interfaces';
import { findUsersById } from './users';

interface WallpaperRow {
  id: string;
  [key: string]: unknown;
}

function camelCaseWallpaperKeys(obj: Record<any, any>): Record<any, any> {
  return {
    ...camelCaseObjectKeys(omit(obj, ['simdata', 'sha256'])),
    ...pick(obj, ['simdata', 'sha256']),
  };
}

function snakeCaseWallpaperKeys(obj: Record<any, any>): Record<any, any> {
  return {
    ...snakeCaseObjectKeys(omit(obj, ['simdata', 'sha256'])),
    ...pick(obj, ['simdata', 'sha256']),
  };
}

/**
 * Type-unsafe covereter of DB records to Wallpapers.
 */
function rowToWallpaper(row: WallpaperRow) {
  return {
    ...camelCaseWallpaperKeys(omit(row, ['rank', 'tsv'])),
    tags: [] as Tag[],
  } as Wallpaper;
}

type WallpaperCreateInput = Omit<Wallpaper,
  'createdAt' | 'updatedAt' | 'tagCount' | 'viewCount' | 'favCount' |
  'favCount1d' | 'favCount1w' | 'favCount1m' | 'featured' | 'tags'
>;

/**
 * Inserts a wallpaper record into the DB.
 */
export async function insertWallpaper(dto: WallpaperCreateInput): Promise<Wallpaper> {
  const [row] = await knex('wallpapers')
    .insert(snakeCaseWallpaperKeys(dto))
    .returning('*');
  return rowToWallpaper(row);
}

type WallpaperUpdateInput = Partial<Exclude<WallpaperCreateInput, 'id'>>
  & Partial<Pick<Wallpaper, 'featured'>>;

/**
 * Makes an update request to database.
 */
export async function updateWallpaper(id: string, dto: WallpaperUpdateInput) {
  const rows = await knex('wallpapers')
    .update(snakeCaseWallpaperKeys(dto))
    .where({ id })
    .returning('*');
  return rows.length > 0 ? rowToWallpaper(rows[0]) : null;
}

/**
 * Returns the absolute path of the wallpaper file by its ID and mimetype.
 */
export function getWallpaperPath(id: string, mimetype: string): string {
  return path.join(config.wallpaper.path, getWallpaperFileName(id, mimetype));
}

/**
 * Returns the absolute path of the wallpaper's thumbnail file by its ID and mimetype.
 */
export function getThumbnailPath(id: string, mimetype: string): string {
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
  const wallpapers = rows.map(rowToWallpaper);
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
  const simdata = await getImageSimdata(thumbPath);
  const avgColor = await getAvgColorOfRgbPixels(simdata);
  await fs.rename(path, getWallpaperPath(id, mimetype));
  const wallpaper = await insertWallpaper({
    id,
    uploaderId,
    mimetype,
    fileSize,
    sha256,
    purity,
    board,
    sourceUrl,
    authorName,
    authorUrl,
    width,
    height,
    ratio: width / height,
    colors,
    simdata,
    avgColor,
  });
  if ((await getFeaturedWallpaperCount()).enabled < FEATURED_WALLPAPER_COUNT) {
    makeWallpaperFeatured(id, uploaderId);
  }
  return wallpaper;
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

  const wallpapers = (await qb).map(rowToWallpaper);

  return {
    wallpapers: withTags ? await injectWallpaperTags(wallpapers) : wallpapers,
    totalCount: parseInt(count + '', 10),
  };
}

/**
 * Loads tags for the wallpapers and returns a copy of the array of wallpapers
 * which have tags array filled up.
 */
export async function injectWallpaperTags(wallpapers: Wallpaper[]): Promise<Wallpaper[]> {
  if (wallpapers.length === 0) return [];
  const tags = await findTagsByWallpaperIds(wallpapers.map(w => w.id));
  return wallpapers.map(wallpaper => ({
    ...wallpaper,
    tags: tags.get(wallpaper.id)!,
  }));
}

/**
 * Loads uploaders for the wallpapers and returns a copy of the array of
 * wallpapers which have the uploader field filled up.
 */
export async function injectWallpaperUploaders(wallpapers: Wallpaper[]): Promise<Wallpaper[]> {
  if (wallpapers.length === 0) return [];
  const users = await findUsersById(uniq(wallpapers.map(w => w.uploaderId)));
  return wallpapers.map(wallpaper => ({
    ...wallpaper,
    uploader: users.find(user => user.id === wallpaper.uploaderId),
  }));
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
  withUploader?: boolean;
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
  withUploader,
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
  let wallpapers = rows.map(rowToWallpaper);
  if (withTags) {
    wallpapers = await injectWallpaperTags(wallpapers);
  }
  if (withUploader) {
    wallpapers = await injectWallpaperUploaders(wallpapers);
  }
  return wallpapers;
}

/**
 * Deletes the wallpaper from DB and removes all the files.
 */
export async function deleteWallpaper(wallpaper: Wallpaper) {
  if (wallpaper.featured) {
    await deleteFeaturedWallpaper(wallpaper.id);
  }
  await knex('wallpapers')
    .where('id', wallpaper.id)
    .delete();
  await fs.unlink(getWallpaperPath(wallpaper.id, wallpaper.mimetype));
  await fs.unlink(getThumbnailPath(wallpaper.id, wallpaper.mimetype));
}

interface FindSimilarWallpapersOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Finds similar wallpapers to the given one with similarity field filled up.
 */
export async function findSimilarWallpapers(wallpaper: Wallpaper, {
  page = 1,
  pageSize = 24,
}: FindSimilarWallpapersOptions = {}) {
  const simdata = wallpaper.simdata.join();
  const rows = await knex({ w: 'wallpapers' })
    .select([
      'w.*',
      knex
        .select(knex.raw('100 - 100 * avg(abs(simdata[i] - c)) / 255'))
        .from(knex.raw(`unnest('{${simdata}}'::integer[]) with ordinality tmp(c, i)`))
        .as('similarity'),
    ])
    .where('id', '!=', wallpaper.id)
    .orderBy('similarity', 'desc')
    .offset((page - 1) * pageSize)
    .limit(pageSize);
  return rows.map(rowToWallpaper);
}

/**
 * The function increments view counters of the wallpaper.
 */
export async function viewWallpaper(wallpaperId: string, userId?: string) {
  await knex('wallpapers')
    .update({
      view_count: knex.raw('view_count + 1'),
    })
    .where('id', wallpaperId);
  if (userId) {
    await knex('users')
      .update({
        wall_view_count: knex.raw('wall_view_count + 1'),
      })
      .where('id', userId);
  }
}

/**
 * Converts FeaturedWallpaperRow to it's respective FeaturedWallpaper representation.
 */
function rowToFeaturedWallpaper(row: FeaturedWallpaperRow): FeaturedWallpaper {
  return {
    ...camelCaseObjectKeys(row),
    description: '',
  };
}

/**
 * Returns the absolute path of the featured wallpaper file by its ID and mimetype.
 */
export function getFeaturedWallpaperPath(id: string, mimetype: string): string {
  return path.join(config.featured.path, getWallpaperFileName(id, mimetype));
}

interface FeaturedWallpaperSearchOptions {
  enabledOnly?: boolean;
  disabledOnly?: boolean;
}

/**
 * Returns featured wallpapers from DB.
 * "Featured" are the wallpapers that are shown in the home page's slider.
 */
export async function findFeaturedWallpapers({
  enabledOnly = false,
  disabledOnly = false,
}: FeaturedWallpaperSearchOptions = {}) {
  const qb = knex<FeaturedWallpaperRow>('featured_wallpapers');
  if (enabledOnly && !disabledOnly) {
    qb.where('enabled', true);
  }
  if (disabledOnly && !enabledOnly) {
    qb.where('enabled', false);
  }
  const wallpapers = (await qb).map(rowToFeaturedWallpaper);
  const tags = await findTagsByWallpaperIds(wallpapers.map(w => w.id));
  return wallpapers.map(wallpaper => ({
    ...wallpaper,
    description: tags.get(wallpaper.id)!.map(t => t.name).join(', '),
  }));
}

/**
 * Makes some regular wallpaper featured.
 * "Featured" are the wallpapers that are shown in the home page's slider.
 */
export async function makeWallpaperFeatured(id: string, userId: string) {
  const wallpaper = await updateWallpaper(id, { featured: true });
  if (!wallpaper) {
    throw new Error(`The wallpaper ${id} doesn't exist`);
  }
  const wallpaperPath = getWallpaperPath(id, wallpaper.mimetype);
  const thumbnailPath = getFeaturedWallpaperPath(id, wallpaper.mimetype);
  await createThumbnail(
    wallpaperPath,
    wallpaper.width,
    wallpaper.height,
    thumbnailPath,
    FEATURED_WALLPAPER_WIDTH,
    FEATURED_WALLPAPER_HEIGHT,
  );
  const rows = await knex('featured_wallpapers')
    .insert<FeaturedWallpaperRow>({
      id,
      user_id: userId,
      mimetype: wallpaper.mimetype,
    })
    .returning<FeaturedWallpaperRow[]>('*');
  return rowToFeaturedWallpaper(rows[0]);
}

/**
 * Unfeatures a featured wallpaper.
 */
export async function deleteFeaturedWallpaper(id: string) {
  const wallpaper = await updateWallpaper(id, { featured: false });
  if (!wallpaper) {
    throw new Error(`The wallpaper ${id} doesn't exist`);
  }
  const rows = await knex('featured_wallpapers')
    .where({ id })
    .delete()
    .returning('id');
  if (rows.length === 0) {
    throw new Error(`The wallpaper ${id} is not featured`);
  }
  await fs.unlink(getFeaturedWallpaperPath(id, wallpaper.mimetype));
}

/**
 * Enables or disables a featured wallpaper.
 * Disabled featured wallpapers are not shown in the slider.
 */
export async function setFeaturedWallpaperEnabled(id: string, enable: boolean) {
  await knex('featured_wallpapers')
    .update('enabled', enable)
    .where({ id });
}

/**
 * Returns counters for featured wallpapers: enabled, disabled ones and total.
 */
export async function getFeaturedWallpaperCount() {
  const rows = await knex.select('enabled', knex.raw('count(*)'))
    .from('featured_wallpapers')
    .groupBy('enabled');
  let [enabled, disabled] = [0, 0];
  for (const row of rows) {
    if (row.enabled) {
      enabled += row.count;
    } else {
      disabled += row.count;
    }
  }
  return {
    enabled,
    disabled,
    total: enabled + disabled,
  };
}
