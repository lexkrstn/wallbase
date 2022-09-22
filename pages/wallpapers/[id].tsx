import { GetServerSideProps } from 'next';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import z from 'zod';
import { Purity } from '@/lib/constants';
import Wallpaper, { getWallpaperUrl } from '@/entities/wallpaper';
import { thousands } from '@/lib/helpers/formatters';
import SimilarWallpaperList from '@/components/similar-wallpaper-list';
import WallpaperSidebar from '@/components/wallpaper-sidebar';
import PurityFlags from '@/components/purity-flags';
import { tryAuthenticateByJwt } from '@/lib/server/passport';
import { findSiblingWallpapers, findWallpaperById, viewWallpaper } from '@/lib/server/wallpapers';
import { DEFAULT_SEARCH_OPTIONS, getSearchOptionsFromQuery } from '@/lib/search-options';
import { getSiblingWallpaperPageUrl } from '@/entities/sibling-wallpaper';
import styles from './wallpaper.module.scss';

interface Props {
  wallpaper: Wallpaper;
  prevWallpaperLink: string;
  nextWallpaperLink: string;
}

const Wallpaper: FC<Props> = ({ wallpaper, prevWallpaperLink, nextWallpaperLink }) => {
  const tags = wallpaper.tags!;
  const [sidebarShown, setSidebarShown] = useState(true);
  const [similarsShown, setSimilarsShown] = useState(false);
  const [purity, setPurity] = useState<Purity>(wallpaper.purity);
  const [zoomed, setZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const isZoomOutPreventedRef = useRef(false);

  const hostClasses = [styles.wallpaper];
  if (sidebarShown) hostClasses.push(styles.sidebarShown);
  if (similarsShown) hostClasses.push(styles.similarsShown);
  if (zoomed) hostClasses.push(styles.zoomed);

  const toggleSidebarShown = useCallback(() => setSidebarShown(shown => !shown), []);

  // Enables pan scrolling of the image frame in zoom mode
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !zoomed) return;
    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScrollTop = 0;
    let startScrollLeft = 0;
    const frameEl = frameRef.current!;
    const maxX = frameEl.scrollWidth - frameEl.clientWidth;
    const maxY = frameEl.scrollHeight - frameEl.clientHeight;
    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault(); // disable dnd
      if (pointerId !== null && event.pointerId !== pointerId) return;
      pointerId = event.pointerId;
      startX = event.screenX;
      startY = event.screenY;
      startScrollTop = frameEl.scrollTop;
      startScrollLeft = frameEl.scrollLeft;
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      const dx = startX - event.screenX;
      const dy = startY - event.screenY;
      if (Math.abs(dx) + Math.abs(dy) > 0) {
        isZoomOutPreventedRef.current = true; // disable zooming out
      }
      frameEl.scrollLeft = Math.max(0, Math.min(maxX, dx + startScrollLeft));
      frameEl.scrollTop = Math.max(0, Math.min(maxY, dy + startScrollTop));
    };
    img.addEventListener('pointerdown', handlePointerDown);
    img.addEventListener('pointerup', handlePointerUp);
    img.addEventListener('pointermove', handlePointerMove);
    return () => {
      img.removeEventListener('pointerdown', handlePointerDown);
      img.removeEventListener('pointerup', handlePointerUp);
      img.removeEventListener('pointermove', handlePointerMove);
    };
  }, [imgRef.current, zoomed]);

  const handleImageClick = () => {
    if (isZoomOutPreventedRef.current) {
      isZoomOutPreventedRef.current = false; // only once
      return;
    }
    setZoomed(prevZoomed => !prevZoomed);
  };

  const handlePurityChange = useCallback((purity: Purity) => {
    setPurity(purity);
  }, []);

  return (
    <div className={hostClasses.join(' ')}>

      <div className={styles.similars}>
        {similarsShown && <SimilarWallpaperList wallpaper={wallpaper} />}
      </div>

      <div className={styles.content}>

        <div className={styles.top}>
          <div className={styles.topBar}>
            <div className={styles.views}>
              Views: <b>{thousands(wallpaper.viewCount)}</b>
            </div>
            <button
              type="button"
              className={`${styles.similarsBtn} ${similarsShown ? styles.active : ''}`}
              onClick={() => setSimilarsShown(shown => !shown)}
            >
              Similar wallpapers
            </button>
          </div>
          <div className={styles.topActions}>
            <PurityFlags purity={purity} onPurityChange={handlePurityChange} />
            <button type="button" className={styles.btnReport} title="Show report dialog">
              <FontAwesomeIcon className={styles.reportIcon} icon={faCircleXmark} />
              <div className={styles.reportTitle}>
                Report
              </div>
              <div className={styles.reportSubtitle}>
                wallpaper
              </div>
            </button>
          </div>
        </div>

        <div className={styles.client}>

          <WallpaperSidebar
            wallpaper={wallpaper}
            prevLink={prevWallpaperLink}
            nextLink={nextWallpaperLink}
            isOpen={sidebarShown}
            onToggleOpen={toggleSidebarShown}
          />

          <div className={styles.view}>
            <div className={styles.viewFrame} ref={frameRef}>
              <div className={styles.viewStage}>
                <img
                  className={styles.image}
                  src={getWallpaperUrl(wallpaper.id, wallpaper.mimetype)}
                  alt={tags.map(tag => tag.name).join(', ')}
                  onClick={handleImageClick}
                  ref={imgRef}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

Wallpaper.displayName = 'Wallpaper';

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const schema = z.object({
    id: z.string().uuid(),
  });
  const query = schema.safeParse(ctx.query);
  if (!query.success) {
    return { notFound: true };
  }

  const wallpaper = await findWallpaperById(query.data.id, {
    withTags: true,
    withUploader: true,
  });
  if (!wallpaper) {
    return { notFound: true };
  }

  const user = await tryAuthenticateByJwt(ctx.req);
  await viewWallpaper(wallpaper.id, user?.id);

  const so = {
    ...DEFAULT_SEARCH_OPTIONS,
    ...getSearchOptionsFromQuery(ctx.query),
  };
  const [prev, next] = await findSiblingWallpapers(wallpaper.id, so);

  return {
    props: {
      wallpaper: JSON.parse(JSON.stringify(wallpaper)),
      prevWallpaperLink: getSiblingWallpaperPageUrl(prev, so),
      nextWallpaperLink: getSiblingWallpaperPageUrl(next, so),
    },
  };
};

export default Wallpaper;
