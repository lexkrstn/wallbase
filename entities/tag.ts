import { KeysToCamelCase } from '@/lib/helpers/type-case';
import { TagRow } from '@/lib/server/interfaces/tag-row';
import Category from './category';

/**
 * Represents the wallpaper tag.
 */
export default interface Tag extends KeysToCamelCase<TagRow> {
  /**
   * In most cases it must be queried explicitly to include this field in
   * search results by service functions.
   *
   * @see injectTagCategories()
   */
  category?: Category;
}
