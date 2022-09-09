/**
 * Represents the wallpaper tag row in the database.
 */
export interface TagRow {
  id: string;
  name: string;
  alias: string;
  created_at: Date;
  creator_id: string;
  category_id: string;
  description: string;
  wallpaper_count: number;
  fav_count: number;
  purity: number;
}
