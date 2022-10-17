import Wallpaper, { getThumbnailUrl, getWallpaperPageUrl } from '@/entities/wallpaper';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';
import Thumbnail from '../thumbnail';
import styles from './similar-wallpaper-list.module.scss';
import { useSimilarWallpapers } from '@/lib/hooks/use-similar-wallpapers';

const SCROLL_THROTTLE = 100;

interface Props {
  wallpaper: Wallpaper;
  visible?: boolean;
  onError?: (err: unknown) => void;
}

const SimilarWallpaperList: FC<Props> = ({ wallpaper, onError }) => {
  const { wallpapers, loading, error } = useSimilarWallpapers(wallpaper.id, {
    onError,
  });
  const [{ canScrollLeft, canScrollRight }, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });
  const frameRef = useRef<HTMLDivElement>(null);

  const updateScrollState = () => {
    const el = frameRef.current;
    if (!el) return;
    setScrollState({
      canScrollLeft: el.scrollLeft > 0,
      canScrollRight: (el.scrollWidth - el.scrollLeft) > el.clientWidth,
    });
  };

  const handleScroll = useCallback(
    throttle(updateScrollState, SCROLL_THROTTLE, { leading: true }),
    [],
  );

  useEffect(() => {
    updateScrollState();
    const resizeHandler = throttle(updateScrollState, SCROLL_THROTTLE);
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [wallpapers?.map(w => w.id).join()]);

  return (
    <div className={styles.host}>
      {(loading || !!error) && (
        <div className={styles.loading}>
          <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
          <div className={styles.loadingText}>
            {error ? 'HTTP error' : 'Loading...'}
          </div>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className={`${styles.leftScrollOverlay} ${canScrollLeft ? styles.shown : ''}`} />
          <div className={`${styles.rightScrollOverlay} ${canScrollRight ? styles.shown : ''}`} />
          <div className={styles.frame} onScroll={handleScroll} ref={frameRef}>
            <ul className={styles.thumbnailList}>
              {wallpapers.map(w => (
                <li className={styles.thumbnailItem} key={w.id}>
                  <Thumbnail
                    id={w.id}
                    width={w.width}
                    height={w.height}
                    url={getThumbnailUrl(w.id, w.mimetype)}
                    href={getWallpaperPageUrl(w.id)}
                    similarity={Math.round(w.similarity!)}
                    noControls
                    hoverable
                    target="_blank"
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
};

SimilarWallpaperList.displayName = 'SimilarWallpaperList';

export default SimilarWallpaperList;
