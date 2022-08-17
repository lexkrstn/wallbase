import path from 'path';
import { MB } from '../lib/constants';

export default {
  secret: process.env.SALT!,
  tokenLifeTime: 7 * 24 * 60 * 60,
  site: {
    name: 'Wallbase',
    domain: process.env.DOMAIN!,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_WALLPAPER_FILE_SIZE || '', 10) || 10 * MB,
    allowedMimeTypes: ['image/jpeg', 'image/png'],
		minWidth: 640,
		minHeight: 640,
		maxWidth: 10000,
		maxHeight: 10000,
		path: path.resolve(__dirname, '..', 'uploads'),
  },
  wallpaper: {
    path: path.resolve(__dirname, '..', 'public', 'wallpapers'),
  },
  thumbnail: {
		width: 250,
		height: 200,
    path: path.resolve(__dirname, '..', 'public', 'thumbnails'),
	},
};
