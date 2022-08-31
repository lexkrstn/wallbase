import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NextPage } from 'next';
import React, { useCallback, useState } from 'react';
import RegularLayout from '@/components/layouts/regular-layout';
import SearchInfoBar from '@/components/search-info-bar';
import ThumbnailGrid from '@/components/thumbnail/grid';
import User from '@/entities/user';
import { canDeleteWallpaper, getThumbnailUrl } from '@/entities/wallpaper';
import {
  DEFAULT_SEARCH_OPTIONS,
  getSearchOptionsFromQuery,
  SearchOptions,
  updateLocationPage,
  updateLocationSearchOptions,
} from '@/lib/search-options';
import Thumbnail from '@/components/thumbnail';
import ThumbnailPageSeparator from '@/components/thumbnail/page-separator';
import { useWallpapersInfinite } from '@/lib/hooks/use-wallpapers-infinite';
import IntersectionTrigger from '@/components/intersection-trigger';
import styles from './wallpapers.module.scss';
import { useDeleteWallpaperModal } from '@/components/modals/delete-wallpaper-modal';
import { useReportModal } from '@/components/modals/report-modal';

interface WallpapersProps {
  user: User | null;
  userLoading: boolean;
  initialSearchOptions: SearchOptions;
}

/**
 * Wallpapers search page.
 */
const Wallpapers: NextPage<WallpapersProps> = ({ user, userLoading, initialSearchOptions }) => {
  const [searchOptions, setSearchOptions] = useState(initialSearchOptions);
  const {
    totalPages, totalCount, pages, reload, isReachingEnd, firstPage, isLoading,
    loadMore, wallpapers, removeWallpaper,
  } = useWallpapersInfinite(searchOptions);

  const deleteModal = useDeleteWallpaperModal({
    onSuccess: removeWallpaper,
  });

  const reportModal = useReportModal();

  const handleSearch = useCallback((so: SearchOptions) => {
    updateLocationSearchOptions(so);
    setSearchOptions(so);
    reload();
  }, []);

  const handleScrolledToEnd = useCallback(() => {
    if (!isReachingEnd && !isLoading) {
      loadMore(newLastPage => updateLocationPage(newLastPage));
    }
  }, [isReachingEnd, isLoading]);

  const handleDeleteClick = useCallback((id: string) => {
    const wallpaper = wallpapers.find(w => w.id === id);
    if (wallpaper) {
      if (canDeleteWallpaper(user, wallpaper)) {
        deleteModal.show(wallpaper);
      } else if (user) {
        reportModal.show(wallpaper, user);
      } else {
        // TODO: AboutWallpaperIssuesModal
      }
    }
  }, [pages, user]);

  return (
    <RegularLayout
      user={user}
      userLoading={userLoading}
      defaultSearchOpen
      onSearch={handleSearch}
      initialSearchOptions={initialSearchOptions}
    >
      <div className={styles.host}>
        {!isLoading && (
          <SearchInfoBar
            total={totalCount ?? 0}
            searchType={searchOptions.query ? 'query' : 'new'}
            query={searchOptions.query}
          />
        )}
        {pages?.map((wallpapers, pageOffset) => (
          <React.Fragment key={firstPage + pageOffset}>
            {(firstPage !== 1 || pageOffset > 0) && (
              <ThumbnailPageSeparator
                page={firstPage + pageOffset}
                totalPages={totalPages!}
              />
            )}
            <ThumbnailGrid>
              {wallpapers.map(w => (
                <Thumbnail
                  key={w.id}
                  id={w.id}
                  width={w.width}
                  height={w.height}
                  url={getThumbnailUrl(w.id, w.mimetype)}
                  purity={w.purity}
                  tags={w.tags}
                  favs={w.favCount}
                  faved={w.faved}
                  mimetype={w.mimetype}
                  onDeleteClick={handleDeleteClick}
                  deleteBtnTitle={canDeleteWallpaper(user, w) ? 'Delete' : 'Make a complaint'}
                  interactive
                />
              ))}
            </ThumbnailGrid>
          </React.Fragment>
        ))}
        {isLoading && (
          <div className={styles.loading}>
            <FontAwesomeIcon icon={faSpinner} />
          </div>
        )}
        {isReachingEnd && totalCount! > 0 && (
          <div className={styles.end}>
            &lt;/&gt; end of the internet
          </div>
        )}
        {totalCount === 0 && (
          <div className={styles.nothing} />
        )}
        {!isReachingEnd && (
          <IntersectionTrigger onIntersect={handleScrolledToEnd} />
        )}
      </div>
      {deleteModal.jsx}
      {reportModal.jsx}
    </RegularLayout>
  );
};

Wallpapers.displayName = 'Wallpapers';

Wallpapers.getInitialProps = async (ctx) => {
  return {
    user: null,
    userLoading: false,
    initialSearchOptions: {
      ...DEFAULT_SEARCH_OPTIONS,
      ...getSearchOptionsFromQuery(ctx.query),
    },
  };
};

export default Wallpapers;
