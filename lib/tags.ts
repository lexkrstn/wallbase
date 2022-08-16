import uniq from 'lodash/uniq';
import Category from '../interfaces/category';
import { PURITY_ALL } from '../interfaces/constants';
import Tag, { TagWithCategory } from '../interfaces/tag';
import knex from './knex';
import { camelCaseObjectKeys } from './utils';

export async function addTagsCategories(tags: Tag[]): Promise<TagWithCategory[]> {
  const categoryIds = uniq(tags.map(tag => tag.categoryId));
  const categoryRows = await knex('categories').whereIn('id', categoryIds);
  const categories = categoryRows.map(camelCaseObjectKeys) as Category[];
  return tags.map(tag => ({
    ...tag,
    category: categories.find(category => category.id === tag.categoryId)!,
  }));
}

export async function getPopularTags(limit = 14): Promise<TagWithCategory[]> {
  const tagRows = await knex('tags')
    // TODO: fav_count_1d
    .orderBy('fav_count', 'desc')
    .limit(limit);
  const tags = tagRows.map(camelCaseObjectKeys) as Tag[];
  return addTagsCategories(tags);
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
}

interface FindTagsResult {
  tags: Tag[];
  totalCount: number;
}

export async function findTags({
  query,
  page = 1,
  perPage = 24,
  purity = PURITY_ALL,
  categoryId = '',
  order = 'desc',
  orderBy,
  fts = false,
}: FindTagsOptions = {}): Promise<FindTagsResult> {
  const countBuilder = knex('tags');
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
  const purityBitmask = purity & PURITY_ALL;
  if (purityBitmask !== 0 && purityBitmask !== PURITY_ALL) {
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
  const tags = await builder;

  return {
    tags: tags as Tag[],
    totalCount: parseInt(count + '', 10),
  };
}
