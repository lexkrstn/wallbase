import { FeaturedWallpaperRow } from '@/lib/server/interfaces';
import { KeysToCamelCase } from '@/lib/helpers/type-case';
import User from './user';
import { getWallpaperFileName } from './wallpaper';

/**
 * "Featured" are the wallpapers that are shown in the home page's slider.
 * The image file of the featured wallpaper is just a resized copy of its
 * respective regular wallpaper's image.
 */
export default interface FeaturedWallpaper extends KeysToCamelCase<FeaturedWallpaperRow> {
  /**
   * Basically, concatenated tag names.
   */
  description: string,
};

/**
 * Returns true is the user is permitted to make wallpapers featured.
 */
export function canFeatureWallpapers(user: User | null) {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'moderator';
}

/**
 * Returns the URL of the wallpaper file by its ID and mimetype.
 */
export function getFeaturedWallpaperUrl(id: string, mimetype: string): string {
  return `/featured/${getWallpaperFileName(id, mimetype)}`;
}
