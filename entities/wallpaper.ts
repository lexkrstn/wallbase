import padStart from 'lodash/padStart';
import { MIMETYPE_TO_EXT } from '@/lib/constants';
import Tag from '@/entities/tag';
import User from '@/entities/user';

/**
 * Represents the wallpaper image.
 */
export default interface Wallpaper {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  uploaderId: string;
  mimetype: string;
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
  simdata: number[];
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
  /**
   * Note, that in most cases it is undefined unless you explicitly call a
   * service function with an option that includes this field.
   */
  faved?: boolean;
  /**
   * Note, that in most cases it is undefined unless you explicitly call a
   * service function with an option that includes this field.
   */
  uploader?: User;
  /**
   * A measure of similarity with some wallpaper from 0 to 100.
   * Note, that this field is available only in response to the request of
   * similar wallpapers.
   */
  similarity?: number;
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
 * Returns the URL of the wallpaper page by its ID.
 */
export function getWallpaperPageUrl(id: string): string {
  return `/wallpapers/${id}`;
}

/**
 * Returns the URL of the wallpaper's thubnail file by its ID and mimetype.
 */
export function getThumbnailUrl(id: string, mimetype: string): string {
  return `/thumbnails/${getWallpaperFileName(id, mimetype)}`;
}

/**
 * Determines whether a specified user can delete a wallpaper.
 */
export function canDeleteWallpaper(user: User | null, wallpaper: Wallpaper) {
  if (!user) return false;
  return wallpaper.uploaderId === user.id || user.role === 'moderator' || user.role === 'admin';
}

/**
 * Returns distinctive wallpaper colors as hex strings starting with #.
 */
export function getWallpaperColorsHex(wallpaper: Wallpaper) {
  const hexes: string[] = [];
  const { colors } = wallpaper;
  for (let i = 0; i < colors.length / 3; i++) {
    const r = padStart(colors[i * 3 + 0].toString(16), 2, '0');
    const g = padStart(colors[i * 3 + 1].toString(16), 2, '0');
    const b = padStart(colors[i * 3 + 2].toString(16), 2, '0');
    hexes.push(`#${r}${g}${b}`);
  }
  return hexes;
}
