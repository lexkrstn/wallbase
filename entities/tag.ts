import Category from './category';

/**
 * Represents the wallpaper tag.
 */
export default interface Tag {
  id: string;
  name: string;
  alias: string;
  createdAt: Date;
  creatorId: string;
  categoryId: string;
  description: string;
  wallpaperCount: number;
  favCount: number;
  purity: number;
  /**
   * In most cases it must be queried explicitly to include this field in
   * search results by service functions.
   *
   * @see injectTagCategories()
   */
  category?: Category;
}
