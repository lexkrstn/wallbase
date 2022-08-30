import { MIMETYPE_TO_EXT } from '@/lib/constants';
import Tag from '@/entities/tag';

/**
 * Represents the wallpaper image.
 */
export default interface Wallpaper {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  uploaderId: string;
  mimetype: string;
  ext: string;
  fileSize: number;
  width: number;
  height: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tagCount: number;
  viewCount: number;
  favCount: number;
  favCount1d: number;
  favCount1w: number;
  favCount1m: number;
  purity: number;
  board: number;
  ratio: number;
  rgb4x4: number[];
  colors: number[];
  avgColor: number[];
  sha256: string;
  featured: boolean;
  /**
   * Note, that in most cases it must be specified explicitly in service
   * functions to include tags into the result. Otherwise the array will
   * be empty.
   *
   * @see injectWallpaperTags()
   */
  tags: Tag[];
}

/**
 * Returns the name of the wallpaper file by its ID and mimetype.
 */
export function getWallpaperFileName(id: string, mimetype: string): string {
  return `${id}.${MIMETYPE_TO_EXT[mimetype]}`;
}

/**
 * Returns the URL of the wallpaper file by its ID and mimetype.
 */
export function getWallpaperUrl(id: string, mimetype: string): string {
  return `/wallpapers/${getWallpaperFileName(id, mimetype)}`;
}

/**
 * Returns the URL of the wallpaper's thubnail file by its ID and mimetype.
 */
export function getThumbnailUrl(id: string, mimetype: string): string {
  return `/thumbnails/${getWallpaperFileName(id, mimetype)}`;
}
