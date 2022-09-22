import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import React, { FC } from 'react';
import Link from 'next/link';
import Wallpaper from '@/entities/wallpaper';
import styles from './wallpaper-sidebar.module.scss';
import ResolutionDropdown from './resolution-dropdown';
import Palette from './palette';
import Toolbar from './toolbar';

interface Props {
  wallpaper: Wallpaper;
  prevLink: string;
  nextLink: string;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const WallpaperSidebar: FC<Props> = ({
  isOpen, wallpaper, prevLink, nextLink, onToggleOpen,
}) => {
  return (
    <aside className={styles.sidebar}>
      <button className={styles.btnToggle} type="button" onClick={onToggleOpen}>
        {isOpen && (
          <FontAwesomeIcon className={styles.toggleIconLeft} icon={faAnglesLeft} />
        )}
        {isOpen ? 'Hide' : 'Show'}
        {!isOpen && (
          <FontAwesomeIcon className={styles.toggleIconRight} icon={faAnglesRight} />
        )}
      </button>
      <div className={styles.top}>
        <Link href="/">
          <a className={styles.logo} />
        </Link>
        <ResolutionDropdown wallpaper={wallpaper} />
      </div>
      <Palette wallpaper={wallpaper} />
      <div className={styles.toolbar}>
        <Toolbar
          wallpaper={wallpaper}
          uploader={wallpaper.uploader!}
          prevLink={prevLink}
          nextLink={nextLink}
        />
      </div>
    </aside>
  );
};

WallpaperSidebar.displayName = 'WallpaperSidebar';

export default WallpaperSidebar;
