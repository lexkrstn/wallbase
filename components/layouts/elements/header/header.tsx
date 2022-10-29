import {
  faBarChart, faComments, faInfoCircle, faRandom, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Tooltip from '../../../tooltip';
import { TextField } from '../../../form';
import styles from './header.module.scss';

interface HeaderProps {
  onSearchOpen?: (open: boolean) => void;
  searchOpen?: boolean;
  defaultQuery?: string;
}

const Header: FC<HeaderProps> = ({ searchOpen, onSearchOpen, defaultQuery }) => {
  const [pathname, setPathname] = useState('');
  const [query, setQuery] = useState(defaultQuery);

  const toggleSearchOpen = useCallback(() => {
    if (onSearchOpen) {
      onSearchOpen(!searchOpen);
    }
  }, [searchOpen, onSearchOpen]);

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  }, []);

  useEffect(() => setPathname(Router.pathname), []);

  return (
    <div className={styles.host}>
      <Link href="/" className={styles.logo} title="Wallpapers" />
      <ul className={styles.nav}>
        <li className={`${styles.search} ${searchOpen ? styles.open : ''}`}>
          <Tooltip message="Show search bar" position="bottom" className={styles.tooltip}>
            <span className={styles.searchIcon} onClick={toggleSearchOpen}>
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </Tooltip>
          <div className={styles.searchbar}>
            <TextField
              name="query"
              placeholder="Search..."
              value={query}
              onChange={handleQueryChange}
            />
          </div>
        </li>
        <li className={`${styles.random} ${pathname === '/random' ? styles.active : ''}`}>
          <Tooltip message="Random" position="bottom" className={styles.tooltip}>
            <Link href="/random" className={styles.link}>
              <FontAwesomeIcon icon={faRandom} />
            </Link>
          </Tooltip>
        </li>
        <li className={`${styles.top} ${pathname === '/top' ? styles.active : ''}`}>
          <Tooltip message="Top" position="bottom" className={styles.tooltip}>
            <Link href="/top" className={styles.link}>
              <FontAwesomeIcon icon={faBarChart} />
            </Link>
          </Tooltip>
        </li>
        <li className={`${styles.comments} ${pathname === '/comments' ? styles.active : ''}`}>
          <Tooltip message="Comments" position="bottom" className={styles.tooltip}>
            <Link href="/comments" className={styles.link}>
              <FontAwesomeIcon icon={faComments} />
            </Link>
          </Tooltip>
        </li>
        <li className={`${styles.about} ${pathname === '/help/about' ? styles.active : ''}`}>
          <Tooltip message="About website" position="bottom" className={styles.tooltip}>
            <Link href="/help/about" className={styles.link}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </Link>
          </Tooltip>
        </li>
      </ul>
    </div>
  );
};

Header.displayName = 'Header';

export default React.memo(Header);
