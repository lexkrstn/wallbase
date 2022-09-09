/**
 * "Featured" are the wallpapers that are shown in the home page's slider.
 * The image file of the featured wallpaper is just a resized copy of its
 * respective regular wallpaper's image.
 */
export interface FeaturedWallpaperRow {
  id: string;
  featured_at: Date;
  user_id: string;
  enabled: boolean;
  mimetype: string;
}
