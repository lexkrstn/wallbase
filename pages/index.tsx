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
import Tag from '../interfaces/tag';
import { getPopularTags } from '../lib/tags';
import { getFeaturedWallpaperSlides } from '../lib/wallpapers';
import styles from './index.module.scss';
import logoImage from './logo.svg';

interface IndexProps {
  popularTags: Tag[] | null;
  featuredWallpaperSlides: FeaturedWallpaperSlide[] | null;
}

const Index: NextPage<IndexProps> = ({ popularTags, featuredWallpaperSlides }) => {
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
        {featuredWallpaperSlides && <Carousel slides={featuredWallpaperSlides} />}
        <Triptych popularTags={popularTags} />
      </div>
    </IndexLayout>
  )
};

Index.defaultProps = {
  popularTags: null,
  featuredWallpaperSlides: null,
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  return {
    props: {
      popularTags: await getPopularTags(),
      featuredWallpaperSlides: await getFeaturedWallpaperSlides(),
    },
  };
};

export default React.memo(Index);
