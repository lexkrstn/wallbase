import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useState } from 'react';
import Carousel from '../components/carousel';
import HomeLayout from '../components/home-layout';
import NavButtons from '../components/nav-buttons';
import SearchFilters from '../components/search-filters';
import SearchLine from '../components/search-line';
import SearchTabs, { SearchByType } from '../components/search-tabs';
import Triptych from '../components/triptych';
import Tag from '../interfaces/tag';
import { getPopularTags } from '../lib/tags';
import styles from './Home.module.scss';
import logoImage from './logo.svg';

interface HomeProps {
  popularTags: Tag[] | null;
}

const Logo = () => (
  <div className={styles.logo}>
    <a href="#" title="Desktop wallpapers" tabIndex={-1}>
      <Image src={logoImage} alt="Wallbase" width={193} height={41} />
    </a>
  </div>
);

const Home: NextPage<HomeProps> = ({ popularTags }: HomeProps) => {
  const [filtersShown, setFiltersShown] = useState(false);
  const [searchBy, setSearchBy] = useState<SearchByType>('keyword');
  return (
    <HomeLayout>
      <div className={styles.home}>
        <Logo />
        <div className={styles.subtitle}>We have wallpapers</div>
        <SearchTabs defaultTab={searchBy} onTabChanged={setSearchBy} />
        <SearchLine
          filtersShown={filtersShown}
          searchBy={searchBy}
          onShowFiltersClick={() => setFiltersShown(!filtersShown)}
        />
        <SearchFilters shown={filtersShown} />
        <div className={styles.or}>
          <span><i className="fa fa-diamond"></i> or <i className="fa fa-diamond"></i></span>
        </div>
        <NavButtons />
        <Carousel />
        <Triptych popularTags={popularTags} />
      </div>
    </HomeLayout>
  )
};

Home.defaultProps = {
  popularTags: null,
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const popularTags = await getPopularTags();
  return {
    props: {
      popularTags,
    },
  };
};

export default React.memo(Home);
