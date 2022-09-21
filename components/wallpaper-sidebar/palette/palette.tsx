import React, { FC } from 'react';
import Link from 'next/link';
import Wallpaper, { getWallpaperColorsHex } from '@/entities/wallpaper';
import styles from './palette.module.scss';

interface Props {
  wallpaper: Wallpaper;
}

const Palette: FC<Props> = ({ wallpaper }) => (
  <div className={styles.host}>
    {getWallpaperColorsHex(wallpaper).map((color, i) => (
      <Link href={`/wallpapers?color=${color.slice(1)}`}>
        <a
          key={`${i}-${color}`}
          className={styles.color}
          style={{ background: color }}
        />
      </Link>
    ))}
  </div>
);

Palette.displayName = 'Palette';

export default Palette;
