export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = DAY * 365;

export const KB = 1024;
export const MB = 1024 * KB;
export const GB = 1024 * MB;
export const TB = 1024 * GB;

export const TOKEN_NAME = 'token';
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export enum Purity {
  SFW = 1 << 0,
  SKETCHY = 1 << 1,
  NSFW = 1 << 2,
  ALL = SFW | SKETCHY | NSFW,
};

export enum Board {
  G = 1 << 0,
  A = 1 << 1,
  P = 1 << 2,
  ALL = G | A | P,
};

export const MIMETYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

export const FEATURED_WALLPAPER_COUNT = 7;
export const FEATURED_WALLPAPER_WIDTH = 980;
export const FEATURED_WALLPAPER_HEIGHT = 220;
