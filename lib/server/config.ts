import path from 'path';
import { MB } from '@/lib/constants';

const PROJECT_ROOT = process.env.PROJECT_ROOT || '.';

const config = {
  secret: process.env.SALT!,
  tokenLifeTime: 7 * 24 * 60 * 60,
  site: {
    name: 'Wallbase',
    domain: process.env.DOMAIN!,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_WALLPAPER_FILE_SIZE || '', 10) || 15 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    minWidth: 640,
    minHeight: 640,
    maxWidth: 10000,
    maxHeight: 10000,
    path: path.join(PROJECT_ROOT, 'uploads'),
  },
  wallpaper: {
    path: path.join(PROJECT_ROOT, 'public', 'wallpapers'),
  },
  thumbnail: {
    width: 250,
    height: 200,
    path: path.resolve(PROJECT_ROOT, 'public', 'thumbnails'),
  },
  featured: {
    path: path.join(PROJECT_ROOT, 'public', 'featured'),
  },
};

export default config;
