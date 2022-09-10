import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook, faPinterest, faRedditAlien, faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import Wallpaper, {
  getWallpaperDownloadUrl, getWallpaperFileName, getWallpaperPageAbsoluteUrl,
} from '@/entities/wallpaper';
import { Board } from '@/lib/constants';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './resolution-dropdown.module.scss';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getSocialShareLink } from '@/lib/helpers/social';
import { hasAncestorNode } from '@/lib/helpers/has-ancestor-node';
import { STANDARD_RESOLUTIONS, WIDE_RESOLUTIONS } from '@/lib/types';

const BOARD_TO_NAME: Record<Board, string> = {
  [Board.G]: 'General',
  [Board.A]: 'Manga / Anime',
  [Board.P]: 'People',
};

interface Props {
  wallpaper: Wallpaper;
}

const ResolutionDropdown: FC<Props> = ({ wallpaper }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useState(false);
  const classes = [styles.host];
  if (isOpen) classes.push(styles.open);
  const url = getWallpaperPageAbsoluteUrl(wallpaper.id);
  const description = 'Awesome Wallpaper';

  useEffect(() => {
    if (!isOpen) return;
    const onDocumentClick = (event: MouseEvent) => {
      // Prevent closing upon clicking on the trigger showing the popup
      if (hasAncestorNode(event.target as Node, hostRef.current)) return;
      setOpen(false);
    };
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, [isOpen]);

  const wideResolutions = WIDE_RESOLUTIONS
    .map(res => res.split('x').map(v => parseInt(v, 10)))
    .filter(([width, height]) => width < wallpaper.width && height < wallpaper.height);

  const standardResolutions = STANDARD_RESOLUTIONS
    .map(res => res.split('x').map(v => parseInt(v, 10)))
    .filter(([width, height]) => width < wallpaper.width && height < wallpaper.height);

  return (
    <div className={classes.join(' ')} ref={hostRef}>
      <div className={styles.button} onClick={() => setOpen(!isOpen)}>
        {`${wallpaper.width}x${wallpaper.height}`}
        <small className={styles.board}>
          {BOARD_TO_NAME[wallpaper.board]}
        </small>
        <div className={styles.chevron}>
          <FontAwesomeIcon className={styles.chevronIcon} icon={faChevronDown} />
        </div>
      </div>
      <div className={styles.dropdown}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.headerText}>Standard resolutions</span>
          </div>
          <ul className={styles.resolutionList}>
            {standardResolutions.map(([width, height]) => (
              <li className={styles.resolutionItem} key={`${width}x${height}`}>
                <a
                  className={styles.resolutionLink}
                  href={getWallpaperDownloadUrl(wallpaper.id, width, height)}
                  download={getWallpaperFileName(wallpaper.id, wallpaper.mimetype)}
                >
                  {width}x{height}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.header}>
            <span className={styles.headerText}>Wide resolutions</span>
          </div>
          <ul className={styles.resolutionList}>
            {wideResolutions.map(([width, height]) => (
              <li className={styles.resolutionItem} key={`${width}x${height}`}>
                <a
                  className={styles.resolutionLink}
                  href={getWallpaperDownloadUrl(wallpaper.id, width, height)}
                  download={getWallpaperFileName(wallpaper.id, wallpaper.mimetype)}
                >
                  {width}x{height}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.sharing}>
          <div className={styles.sharingTitle}>Sharing link</div>
          <input className={styles.textInput} type="text" value={url} readOnly />
          <ul className={styles.socialList}>
            <li className={styles.socialItem}>
              <a
                className={styles.socialLink}
                href={getSocialShareLink('facebook', url, description)}
              >
                <FontAwesomeIcon className={styles.fb} icon={faFacebook} />
              </a>
            </li>
            <li className={styles.socialItem}>
              <a
                className={styles.socialLink}
                href={getSocialShareLink('twitter', url, description)}
              >
                <FontAwesomeIcon className={styles.twitter} icon={faTwitter} />
              </a>
            </li>
            <li className={styles.socialItem}>
              <a
                className={styles.socialLink}
                href={getSocialShareLink('pinterest', url, description)}
              >
                <FontAwesomeIcon className={styles.pinterest} icon={faPinterest} />
              </a>
            </li>
            <li className={styles.socialItem}>
              <a
                className={styles.socialLink}
                href={getSocialShareLink('reddit', url, description)}
              >
                <FontAwesomeIcon className={styles.reddit} icon={faRedditAlien} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

ResolutionDropdown.displayName = 'ResolutionDropdown';

export default React.memo(ResolutionDropdown);
