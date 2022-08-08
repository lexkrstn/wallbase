import React, { FC, useState } from 'react';
import styles from './search-expansion.module.scss';
import SearchOptionsHelp from './search-options-help';
import Tabs from '../tabs';
import SearchControlsTriptych from './search-controls-triptych';

const TAB_LABELS = ['Filters', 'Search options'];

const SearchExpansion: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.host}>
      <Tabs
        labels={TAB_LABELS}
        active={activeTab}
        onChange={setActiveTab}
      />
      {activeTab === 0 && (
        <SearchControlsTriptych />
      )}
      {activeTab === 1 && (
        <SearchOptionsHelp />
      )}
    </div>
  );
};

SearchExpansion.displayName = 'SearchExpansion';

export default React.memo(SearchExpansion);
