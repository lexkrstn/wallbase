import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NextPage } from 'next';
import { useRouter, withRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import RegularLayout from '@/components/layouts/regular-layout';
import SearchInfoBar from '@/components/search-info-bar';
import ThumbnailGrid from '@/components/thumbnail/grid';
import User from '@/entities/user';
import { getThumbnailUrl } from '@/entities/wallpaper';
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
    loadMore,
  } = useWallpapersInfinite(searchOptions);

  const handleSearch = useCallback((so: SearchOptions) => {
    updateLocationSearchOptions(so);
    setSearchOptions(so);
    reload();
  }, []);

  const handleScrolledToEnd = useCallback(() => {
    console.log('SCROLL END')
    if (!isReachingEnd && !isLoading) {
      loadMore(newLastPage => updateLocationPage(newLastPage));
    }
  }, [isReachingEnd, isLoading]);

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
                  board={w.board}
                  purity={w.purity}
                  tags={w.tags}
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
