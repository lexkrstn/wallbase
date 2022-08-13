import uniq from 'lodash/uniq';
import Category from '../interfaces/category';
import Tag, { TagWithCategory } from '../interfaces/tag';
import knex from './knex';
import { camelCaseObjectKeys } from './utils';

export async function getPopularTags(limit = 14): Promise<TagWithCategory[]> {
  const tagRows = await knex('tags')
    // TODO: fav_count_1d
    .orderBy('fav_count', 'desc')
    .limit(limit);
  const tags = tagRows.map(camelCaseObjectKeys) as Tag[];
  const categoryIds = uniq(tags.map(tag => tag.categoryId));
  const categoryRows = await knex('categories').whereIn('id', categoryIds);
  const categories = categoryRows.map(camelCaseObjectKeys) as Category[];
  return tags.map(tag => ({
    ...tag,
    category: categories.find(category => category.id === tag.categoryId)!,
  }));
}
