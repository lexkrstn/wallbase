import path from 'path';
import FeaturedWallpaperSlide from '../interfaces/featured-wallpaper-slide';

const PUBLIC_PATH = path.resolve(__dirname, '..', 'public');
export const WALLPAPERS_PATH = path.join(PUBLIC_PATH, 'wallpapers');
export const THUMBNAILS_PATH = path.join(PUBLIC_PATH, 'thumbnails');

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
