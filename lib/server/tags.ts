import uniq from 'lodash/uniq';
import { Purity } from '@/lib/constants';
import Tag from '@/entities/tag';
import knex from '@/lib/server/knex';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '../helpers/object-keys';
import { findCategoriesById } from './categories';

/**
 * Incomplete type definition of the Tag record in DB.
 */
interface TagRow {
  id: string;
  [k: string]: unknown;
}

function dbRowToTag(row: TagRow): Tag {
  return camelCaseObjectKeys(row) as Tag;
}

function tagToDbRow(row: Tag): TagRow {
  return snakeCaseObjectKeys(row) as TagRow;
}

/**
 * Searches in DB for each tag which ID is one of the given ones.
 */
export async function findTagsById(ids: string[]) {
  const tags = await knex<TagRow>('tags').whereIn('id', ids);
  return tags.map(dbRowToTag);
}

/**
 * Loads categories for the tags and returns a copy of the array of tags
 * which have category field filled up.
 */
export async function injectTagCategories(tags: Tag[]): Promise<Tag[]> {
  const categoryIds = uniq(tags.map(tag => tag.categoryId));
  const categories = await findCategoriesById(categoryIds);
  return tags.map(tag => ({
    ...tag,
    category: categories.find(category => category.id === tag.categoryId)!,
  }));
}

/**
 * Returns N the most popular tags from DB.
 */
export async function getPopularTags(limit = 14): Promise<Tag[]> {
  const tagRows = await knex<TagRow>('tags')
    // TODO: fav_count_1d
    .orderBy('fav_count', 'desc')
    .limit(limit);
  const tags = tagRows.map(dbRowToTag);
  return injectTagCategories(tags);
}

interface FindTagsOptions {
  query?: string;
  page?: number;
  perPage?: number;
  categoryId?: string;
  purity?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'name' | 'wallpaper_count' | 'fav_count';
  fts?: boolean;
  withCategory?: boolean;
}

/**
 * Searches for the tags in DB by search options.
 */
export async function findTags({
  query,
  page = 1,
  perPage = 24,
  purity = Purity.ALL,
  categoryId = '',
  order = 'desc',
  orderBy,
  fts = false,
  withCategory = false,
}: FindTagsOptions = {}) {
  const countBuilder = knex<TagRow>('tags');
  if (query) {
    if (fts) {
      countBuilder.whereRaw('tsv @@ plainto_tsquery(\'english\', ?)', query);
    } else {
      countBuilder.whereRaw(
        'lower(name || \' \' || alias) LIKE \'%\' || ? || \'%\'',
        query.toLowerCase(),
      );
    }
  }
  if (categoryId) {
    countBuilder.where('category_id', categoryId);
  }
  const purityBitmask = purity & Purity.ALL;
  if (purityBitmask !== 0 && purityBitmask !== Purity.ALL) {
    countBuilder.whereRaw(`(purity & ?) <> 0`, purityBitmask);
  }

  const builder = countBuilder.clone()
    .offset((page - 1) * perPage)
    .limit(perPage);
  if (query && fts) {
    builder.orderByRaw('ts_rank(tsv, plainto_tsquery(\'english\', ?))', query)
  } else if (orderBy) {
    builder.orderBy(orderBy, order);
  }

  const [{ count }] = await countBuilder.count();
  let tags = (await builder).map(dbRowToTag);

  if (withCategory) {
    tags = await injectTagCategories(tags);
  }

  return {
    tags,
    totalCount: parseInt(count + '', 10),
  };
}
