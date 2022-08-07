import React, { FC, MouseEvent, useCallback, useState } from 'react';
import styles from './search-tabs.module.scss';
import Tooltip from './tooltip';

export type SearchByType = 'keyword' | 'color';

interface SearchTabsProps {
  defaultTab: SearchByType;
  onTabChanged: (tab: SearchByType) => void;
}

const SearchTabs: FC<SearchTabsProps> = ({ defaultTab, onTabChanged }) => {
  const [activeTab, setActiveTab] = useState<SearchByType>(defaultTab);
  const handleTabClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const tab = event.currentTarget.dataset.tab as SearchByType;
    setActiveTab(tab);
    onTabChanged(tab);
  }, [onTabChanged]);
  return (
    <div className={styles.host}>
      <div className={styles.label}>Search by</div>
      <div className={`${styles.by} ${activeTab === 'keyword' ? styles.byActive : ''}`}>
        <button type="button" onClick={handleTabClick} data-tab="keyword">Keywords</button>
      </div>
      <div className={`${styles.by} ${activeTab === 'color' ? styles.byActive : ''}`}>
        <button type="button" onClick={handleTabClick} data-tab="color">Color</button>
      </div>
      <div className={styles.tip}>
        {'— Available search options: '}
        <Tooltip message="Use quotation marks to make the query more strict." inline>
          <code>"keyword"</code>
        </Tooltip>,
        {' '}
        <Tooltip message="Exclude keywords you don't want to appear in the results page." inline>
          <code>not:word</code>
        </Tooltip>
        {' and '}
        <Tooltip message="Jump directly to the specified results page." inline>
          <code>page:123</code>
        </Tooltip>.
        {' Try them out.'}
      </div>
    </div>
  );
};

SearchTabs.displayName = 'SearchTabs';

export default SearchTabs;
