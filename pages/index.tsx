import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Tag from '@/entities/tag';
import { getWallpaperPageUrl } from '@/entities/wallpaper';
import FeaturedWallpaper, { getFeaturedWallpaperUrl } from '@/entities/featured-wallpaper';
import Carousel from '@/components/carousel';
import IndexLayout from '@/components/layouts/index-layout';
import NavButtons from '@/components/nav-buttons';
import SearchExpansion from '@/components/search-expansion';
import SearchLine from '@/components/search-line';
import SearchTabs, { SearchByType } from '@/components/search-tabs';
import Triptych from '@/components/triptych';
import logoImage from '@/components/layouts/elements/header/logo.svg';
import { getStatistics, Statistics } from '@/lib/server/stats';
import { getPopularTags } from '@/lib/server/tags';
import { findFeaturedWallpapers } from '@/lib/server/wallpapers';
import styles from './index.module.scss';

interface IndexServerSideProps {
  popularTags: Tag[] | null;
  featuredWallpapers: FeaturedWallpaper[] | null;
  stats: Statistics;
}

type IndexProps = IndexServerSideProps;

const Index: NextPage<IndexProps> = ({
  popularTags, featuredWallpapers, stats,
}) => {
  const [filtersShown, setFiltersShown] = useState(false);
  const [searchBy, setSearchBy] = useState<SearchByType>('keyword');
  return (
    <IndexLayout>
      <div className={styles.home}>
        <div className={styles.logo}>
          <Link href="/">
            <a title="Desktop wallpapers" tabIndex={-1}>
              <Image src={logoImage} alt="Wallbase" width={193} height={41} />
            </a>
          </Link>
        </div>
        <div className={styles.subtitle}>We have wallpapers</div>
        <SearchTabs defaultTab={searchBy} onTabChanged={setSearchBy} />
        <SearchLine
          filtersShown={filtersShown}
          searchBy={searchBy}
          onShowFiltersClick={() => setFiltersShown(!filtersShown)}
        />
        {filtersShown && <SearchExpansion />}
        <div className={styles.or}>
          <span>{' or '}</span>
        </div>
        <NavButtons />
        {featuredWallpapers && (
          <Carousel
            slides={featuredWallpapers.map(w => ({
              image: getFeaturedWallpaperUrl(w.id, w.mimetype),
              href: getWallpaperPageUrl(w.id),
              description: w.description,
            }))}
          />
        )}
        <Triptych popularTags={popularTags} stats={stats} />
      </div>
    </IndexLayout>
  )
};

export const getServerSideProps: GetServerSideProps<IndexServerSideProps> = async () => {
  const popularTags = await getPopularTags();
  const featuredWallpapers = await findFeaturedWallpapers({ enabledOnly: true });
  return {
    props: {
      popularTags: JSON.parse(JSON.stringify(popularTags)),
      featuredWallpapers: JSON.parse(JSON.stringify(featuredWallpapers)),
      stats: await getStatistics(),
    },
  };
};

export default React.memo(Index);
