import padStart from 'lodash/padStart';
import { MIMETYPE_TO_EXT } from '@/lib/constants';
import Tag from '@/entities/tag';
import User from '@/entities/user';
import { KeysToCamelCase } from '@/lib/helpers/type-case';
import { WallpaperRow } from '@/lib/server/interfaces';
import getConfig from 'next/config';

/**
 * Represents the wallpaper image.
 */
export default interface Wallpaper extends KeysToCamelCase<WallpaperRow> {
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
export function getWallpaperFileName(id: string, mimetype: string) {
  return `${id}.${MIMETYPE_TO_EXT[mimetype]}`;
}

/**
 * Returns the URL of the wallpaper file by its ID and mimetype.
 */
export function getWallpaperUrl(id: string, mimetype: string) {
  return `/wallpapers/${getWallpaperFileName(id, mimetype)}`;
}

/**
 * Returns the URL of the wallpaper page by its ID.
 */
export function getWallpaperPageUrl(id: string) {
  return `/wallpapers/${id}`;
}

/**
 * Returns the URL of the wallpaper page by its ID.
 */
 export function getWallpaperPageAbsoluteUrl(id: string): string {
  return `${getConfig().publicRuntimeConfig.siteUrl}/wallpapers/${id}`;
}

/**
 * Returns the download link of the wallpaper by its ID.
 */
export function getWallpaperDownloadUrl(id: string, width: number, height: number) {
  return `/api/wallpapers/${id}/download?width=${width}&height=${height}`;
}

/**
 * Returns the URL of the wallpaper's thubnail file by its ID and mimetype.
 */
export function getThumbnailUrl(id: string, mimetype: string) {
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
