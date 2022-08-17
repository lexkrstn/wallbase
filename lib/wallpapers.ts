import path from 'path';
import uuid from 'uuid';
import fs from 'fs/promises';
import FeaturedWallpaperSlide from '../interfaces/featured-wallpaper-slide';
import Wallpaper from '../interfaces/wallpaper';
import config from './config';
import { getFileHash } from './hash';
import knex from './knex';
import { camelCaseObjectKeys, kebabCaseObjectKeys } from './utils';
import {
  createThumbnail, getAvgColorOfRgbPixels, getImage4x4Pixels,
  getImageDistinctiveColors, getImageSize,
} from './image';

const MIMETYPE_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export async function getFeaturedWallpaperSlides(): Promise<FeaturedWallpaperSlide[]> {
  return [
    {
      image: 'https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg',
      href: `/walls/1`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/x8/wallhaven-x8rwzo.jpg',
      href: `/walls/2`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/j3/wallhaven-j3glxy.jpg',
      href: `/walls/3`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/wq/wallhaven-wq9v8p.jpg',
      href: `/walls/4`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/28/wallhaven-2879mg.png',
      href: `/walls/5`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/g7/wallhaven-g7yv8q.jpg',
      href: `/walls/6`,
      description: 'Blah',
    },
    {
      image: 'https://w.wallhaven.cc/full/rd/wallhaven-rdm6km.png',
      href: `/walls/7`,
      description: 'Blah',
    },
  ];
}

type CreateWallpaperDto = Omit<Wallpaper,
  'createdAt' | 'updatedAt' | 'tagCount' | 'viewCount' | 'favCount' |
  'favCount1d' | 'favCount1w' | 'favCount1m' | 'featured'
>;

export async function insertWallpaper(dto: CreateWallpaperDto): Promise<Wallpaper> {
  const [row] = await knex('wallpapers')
    .insert(kebabCaseObjectKeys(dto))
    .returning('*');
  return camelCaseObjectKeys(row) as Wallpaper;
}

function getWallpaperFileName(id: string, mimetype: string): string {
  return `${id}.${MIMETYPE_TO_EXT[mimetype]}`;
}

function getWallpaperPath(id: string, mimetype: string): string {
  return path.join(config.wallpaper.path, getWallpaperFileName(id, mimetype));
}

function getThumbnailPath(id: string, mimetype: string): string {
  return path.join(config.thumbnail.path, getWallpaperFileName(id, mimetype));
}

async function findIdenticalWallpaperByFile(
  filePath: string,
  sha256: string,
): Promise<Wallpaper | null> {
  const rows = await knex('wallpaper').where({ sha256 });
  const wallpapers = rows.map(camelCaseObjectKeys) as Wallpaper[];
  const file = await fs.readFile(filePath);
  for (const wallpaper of wallpapers) {
    const file2 = await fs.readFile(getWallpaperPath(wallpaper.id, wallpaper.mimetype));
    if (file.equals(file2)) {
      return wallpaper;
    }
  }
  return null;
}

export class DuplicateWallpaperError extends Error {
  public constructor(public id: string) {
    super('This image is already on the site');
    Error.captureStackTrace(this);
  }
}

interface UploadWallpaperDto {
  path: string;
  mimetype: string;
  fileSize: number;
  purity: number;
  board: number;
  uploaderId: string;
  sourceUrl?: string;
  authorUrl?: string;
  authorName?: string;
}

export async function uploadWallpaper({
  path,
  mimetype,
  fileSize,
  uploaderId,
  purity,
  board,
  sourceUrl = '',
  authorUrl = '',
  authorName = '',
}: UploadWallpaperDto): Promise<Wallpaper> {
  const sha256 = await getFileHash(path, 'sha256');
  const duplicate = await findIdenticalWallpaperByFile(path, sha256);
  if (duplicate) {
    throw new DuplicateWallpaperError(duplicate.id);
  }
  const id = uuid.v4();
  const thumbPath = getThumbnailPath(id, mimetype);
  const thumbWidth = config.thumbnail.width;
  const thumbHeight = config.thumbnail.height;
  const { width, height } = await getImageSize(path);
  await createThumbnail(path, width, height, thumbPath, thumbWidth, thumbHeight);
  const colors = await getImageDistinctiveColors(thumbPath, thumbWidth, thumbHeight);
  const rgb4x4 = await getImage4x4Pixels(thumbPath);
  const avgColor = await getAvgColorOfRgbPixels(rgb4x4);
  await fs.rename(path, getWallpaperPath(id, mimetype));
  return await insertWallpaper({
    id,
    uploaderId,
    mimetype,
    fileSize,
    sha256,
    ext: MIMETYPE_TO_EXT[mimetype],
    purity,
    board,
    sourceUrl,
    authorName,
    authorUrl,
    width,
    height,
    ratio: width / height,
    colors,
    rgb4x4,
    avgColor,
  });
}
