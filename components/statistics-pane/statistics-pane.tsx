import React, { FC } from 'react';
import { formatFileSize, thousands } from '@/lib/helpers/formatters';
import { Statistics } from '@/lib/server/stats';
import Button from '../buttons/button';
import styles from './statistics-pane.module.scss';

interface StatisticsPaneProps {
  stats: Statistics;
}

const StatisticsPane: FC<StatisticsPaneProps> = ({ stats }) => (
  <div className={styles.host}>
    <div className={styles.row}>
      All wallpapers:
      <span>{thousands(stats.totalWallpapers)}</span>
    </div>
    <div className={styles.rowInner}>
      Wallpapers / General:
      <span>{thousands(stats.generalWallpapers)}</span>
    </div>
    <div className={styles.rowInner}>
      Anime / Manga:
      <span>{thousands(stats.animeWallpapers)}</span>
    </div>
    <div className={styles.rowInner}>
      Wallpapers / People:
      <span>{thousands(stats.peopleWallpapers)}</span>
    </div>

    <div className={styles.rowDark}>
      Images added today:
      <span>{thousands(stats.wallpapersAdded24h)}</span>
    </div>

    <div className={styles.row}>
      Registered users:
      <span>{thousands(stats.totalUsers)}</span>
    </div>
    <div className={styles.rowInner}>
      Users registered last 24h:
      <span className={styles.white}>{thousands(stats.newUsers24h)}</span>
    </div>
    <div className={styles.rowBtn}>
      <Button rounded xsmall dark href="/users">show users</Button>
    </div>

    <div className={styles.rowDark}>
      Unique favorite wallpapers:
      <span className={styles.white}>{thousands(stats.favoritedWallpapers)}</span>
      <br/>
      Favorites:
      <span className={styles.white}>{thousands(stats.totalFavorites)}</span>
    </div>

    <div className={styles.row}>
      Wallpaper storage:
      <span>{formatFileSize(stats.wallpapersFileSize)}</span>
    </div>
    <div className={styles.rowInner}>
      Disk size:
      <span>{formatFileSize(stats.diskSize, 0)}</span>
    </div>
    <div className={styles.rowInner}>
      Free space:
      <span>{formatFileSize(stats.diskFreeSpace, 0)}</span>
    </div>
    <div className={styles.rowInner}>
      Memory:
      <span>
        {formatFileSize(stats.appMemory, 0)}
        {' / '}
        {(100 * (stats.osTotalMemory - stats.osFreeMemory) / stats.osTotalMemory).toFixed(1)}%
      </span>
    </div>

    <div className={styles.rowDark}>
      Tags:
      <span className={styles.white}>{thousands(stats.totalTags)}</span>
    </div>
  </div>
);

StatisticsPane.displayName = 'StatisticsPane';

export default StatisticsPane;
