import Category from '@/entities/category';
import knex from '@/lib/server/knex';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '../helpers/object-keys';

/**
 * Incomplete type definition of the Tag record in DB.
 */
interface CategoryRow {
  id: string;
  [k: string]: unknown;
}

function dbRowToCategory(row: CategoryRow): Category {
  return camelCaseObjectKeys(row) as Category;
}

function categoryToDbRow(row: Category): CategoryRow {
  return snakeCaseObjectKeys(row) as CategoryRow;
}

/**
 * Searches in DB for each tag which ID is one of the given ones.
 */
export async function findCategoriesById(ids: string[]) {
  const tags = await knex<CategoryRow>('categories').whereIn('id', ids);
  return tags.map(dbRowToCategory);
}
