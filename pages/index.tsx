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

const SLIDES = [
  {
    image: 'https://w.wallhaven.cc/full/l3/wallhaven-l3xk6q.jpg',
    href: `/walls/1`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/x8/wallhaven-x8rwzo.jpg',
    href: `/walls/2`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/j3/wallhaven-j3glxy.jpg',
    href: `/walls/3`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/wq/wallhaven-wq9v8p.jpg',
    href: `/walls/4`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/28/wallhaven-2879mg.png',
    href: `/walls/5`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/g7/wallhaven-g7yv8q.jpg',
    href: `/walls/6`,
    description: 'Blah',
  },
  {
    image: 'https://w.wallhaven.cc/full/rd/wallhaven-rdm6km.png',
    href: `/walls/7`,
    description: 'Blah',
  },
];

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
        <Carousel slides={SLIDES} />
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
