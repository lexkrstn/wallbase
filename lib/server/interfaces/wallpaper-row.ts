/**
 * Represents the wallpaper row in the database.
 */
export interface WallpaperRow {
  id: string;
  created_at: string;
  updated_at: string;
  uploader_id: string;
  mimetype: string;
  file_size: number;
  width: number;
  height: number;
  source_url: string;
  author_name: string;
  author_url: string;
  tag_count: number;
  view_count: number;
  fav_count: number;
  fav_count_1d: number;
  fav_count_1w: number;
  fav_count_1m: number;
  purity: number;
  board: number;
  ratio: number;
  simdata: number[];
  colors: number[];
  avg_color: number[];
  sha256: string;
  featured: boolean;
}
