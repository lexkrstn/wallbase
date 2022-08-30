import React, { FC } from 'react';
import { thousands } from '@/lib/helpers/formatters';
import styles from './search-info-bar.module.scss';

interface SearchInfoBarProps {
  total: number;
  searchType: 'new' | 'random' | 'top' | 'query';
  query?: string;
}

const SearchInfoBar: FC<SearchInfoBarProps> = ({
  total, searchType, query = '',
}) => {
  return (
    <div className={styles.host}>
      <div className={styles.imgshow}>
        { thousands(total) }
      </div>
      <div className={styles.content}>
        {'You searched for '}
        <span className={styles.searchSubject}>
          {searchType === 'new' && 'New wallpapers'}
          {searchType === 'random' && 'Randomly ordered wallpapers'}
          {searchType === 'top' && 'Best wallpapers'}
          {searchType === 'query' && `"${query}"`}
        </span>
        <br />
        <small>
          {searchType == 'random' && (
            <>
              Warning: this section is too addictive.
              Leave now or you\'ll lose a couple of hours of your life here.
            </>
          )}
          {searchType == 'top' && (
            <>
              The list below shows the most popular images on wallbase
            </>
          )}
          {searchType == 'new' && (
            <>
              The list below shows the most recent uploads on wallbase
            </>
          )}
          {searchType == 'query' && (
            <>
              <b>TIP</b>
              {': Do not search wallpapers by too SUBJECTIVE criteria like '}
              <code>"cute puppies"</code>
              {' or '}
              <code>"pretty girls"</code>
              !
            </>
          )}
        </small>
      </div>
      {false && (
        <div className={styles.right}>
          <ul className={styles.tabs}>
            <li className={`${styles.tab} ${styles.active}`}>
              <button type="button" className={styles.tabBtn}>
                <span>544,419</span>
                {' Wallpapers'}
              </button>
            </li>
            <li className={styles.tab}>
              <button type="button" className={styles.tabBtn}>
                <span>4,781</span>
                {' User collections'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
};

SearchInfoBar.displayName = 'SearchInfoBar';

export default React.memo(SearchInfoBar);
