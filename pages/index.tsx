import type { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Carousel from '../components/carousel';
import IndexLayout from '../components/layouts/index-layout';
import NavButtons from '../components/nav-buttons';
import SearchExpansion from '../components/search-expansion';
import SearchLine from '../components/search-line';
import SearchTabs, { SearchByType } from '../components/search-tabs';
import Triptych from '../components/triptych';
import FeaturedWallpaperSlide from '../interfaces/featured-wallpaper-slide';
import { TagWithCategory } from '../interfaces/tag';
import User from '../interfaces/user';
import { getStatistics, Statistics } from '../lib/stats';
import { getPopularTags } from '../lib/tags';
import { getFeaturedWallpaperSlides } from '../lib/wallpapers';
import styles from './index.module.scss';
import logoImage from '../components/layouts/elements/header/logo.svg';

interface IndexServerSideProps {
  popularTags: TagWithCategory[] | null;
  featuredWallpaperSlides: FeaturedWallpaperSlide[] | null;
  stats: Statistics;
}

interface IndexAppProps {
  user: User | null;
  userLoading: boolean;
}

type IndexProps = IndexServerSideProps & IndexAppProps;

const Index: NextPage<IndexProps> = ({
  popularTags, featuredWallpaperSlides, stats, user, userLoading,
}) => {
  const [filtersShown, setFiltersShown] = useState(false);
  const [searchBy, setSearchBy] = useState<SearchByType>('keyword');
  return (
    <IndexLayout user={user} userLoading={userLoading}>
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
        {featuredWallpaperSlides && <Carousel slides={featuredWallpaperSlides} />}
        <Triptych popularTags={popularTags} stats={stats} />
      </div>
    </IndexLayout>
  )
};

export const getServerSideProps: GetServerSideProps<IndexServerSideProps> = async () => {
  return {
    props: {
      popularTags: JSON.parse(JSON.stringify(await getPopularTags())),
      featuredWallpaperSlides: await getFeaturedWallpaperSlides(),
      stats: await getStatistics(),
    },
  };
};

export default React.memo(Index);
