import React, { FC, useCallback, useState } from 'react';
import OrderBySelectbox, { OrderByType, OrderType } from './selectboxes/order-by-selectbox';
import ResolutionSelectbox, {
  ResolutionOperatorType,
  ResolutionType,
} from './selectboxes/resolution-selectbox';
import AspectSelectbox, { AspectType } from './selectboxes/aspect-selectbox';
import PageSizeSelectbox, { PageSizeType } from './selectboxes/page-size-selectbox';
import BoardFilter from './triple-filters/board-filter';
import PurityFilter from './triple-filters/purity-filter';
import styles from './search-filters.module.scss';

interface SearchFiltersProps {
  shown: boolean;
}

const SearchFilters: FC<SearchFiltersProps> = ({ shown }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [aspect, setAspect] = useState<AspectType>('');
  const [pageSize, setPageSize] = useState<PageSizeType>(24);
  const [orderBy, setOrderBy] = useState<OrderByType>('relevancy');
  const [order, setOrder] = useState<OrderType>('desc');
  const [resolutionOp, setResolutionOp] = useState<ResolutionOperatorType>('gt');
  const [resolution, setResolution] = useState<ResolutionType>('');

  const onAspectChange = useCallback((value: AspectType) => setAspect(value), []);
  const onPageSizeChange = useCallback((value: PageSizeType) => setPageSize(value), []);
  const onOrderByChange = useCallback((value: OrderByType) => setOrderBy(value), []);
  const onOrderChange = useCallback((value: OrderType) => setOrder(value), []);
  const onResolutionOpChange = useCallback((value: ResolutionOperatorType) => {
    setResolutionOp(value);
  }, []);
  const onResolutionChange = useCallback((value: ResolutionType) => setResolution(value), []);

  return (
    <div className={styles.host + ' ' + (shown ? styles.hostShown : '')}>
      <ul className={styles.nav}>
        <li className={activeTab === 0 ? styles.navActive : ''}>
          <button type="button" onClick={() => setActiveTab(0)}>Filters</button>
        </li>
        <li className={activeTab === 1 ? styles.navActive : ''}>
          <button type="button" onClick={() => setActiveTab(1)}>Search options</button>
        </li>
      </ul>
      <div className={styles.tab + ' ' + (activeTab === 0 ? styles.tabActive : '')}>
        <div className={styles.triptych}>

          <div className={styles.triptychFold}>
            <div className={styles.field}>
              <div className={styles.label}>Category / Board</div>
              <BoardFilter />
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Order by</div>
              <OrderBySelectbox
                onChange={onOrderByChange}
                onOrderChange={onOrderChange}
                value={orderBy}
                order={order}
              />
            </div>
          </div>

          <div className={styles.triptychFold}>
            <div className={styles.field}>
              <div className={styles.label}>Resolution</div>
              <ResolutionSelectbox
                onChange={onResolutionChange}
                onOperatorChange={onResolutionOpChange}
                value={resolution}
                operator={resolutionOp}
              />
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Aspect ratio</div>
              <AspectSelectbox onChange={onAspectChange} value={aspect} />
            </div>
          </div>

          <div className={styles.triptychFold}>
            <div className={styles.field}>
              <div className={styles.label}>Purity filter</div>
              <PurityFilter />
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Thumbs per page</div>
              <PageSizeSelectbox onChange={onPageSizeChange} value={pageSize} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tab + ' ' + (activeTab === 1 ? styles.tabActive : '')}>
        <div className={styles.desc}>
          Search options below apply to the search input field.<br/>
          Examples: <span>jessica alba not:biel page:46</span> {' '} or {' '}
          <span>"ergo proxy" imgtype:png imgtype:gif</span> {' '} or {' '}
          <span>nature uploader:users</span>
        </div>
        <div className={styles.helpTable}>
          <div className={styles.helpRow}>
            <div className={styles.helpCell}>
              <span className={styles.key}>some keywords</span><br/>
              Just type keywords to find wallpapers tagged with at least one of them (every word is a keyword).
            </div>
            <div className={styles.helpCell}>
              <span className={styles.key}>"some words"</span><br/>
              Use quotation marks to make the query more strict (the words are treated as a keyword).
            </div>
            <div className={styles.helpCell}>
              <span className={styles.key}>not</span>:<span className={styles.value}>word</span><br/>
              Exclude keywords you don't want to appear in the results page. To use spaces wrap your words in quotation marks.
            </div>
          </div>
          <div className={styles.helpRow}>
            <div className={styles.helpCell}>
              <span className={styles.key}>uploader</span>:<span className={styles.value}>[users|bot]</span><br/>
              Select uploaders. Bot - 4chan imageboard users, users - users uploaded directly to wallbase.
            </div>
            <div className={styles.helpCell}>
              <span className={styles.key}>page</span>:<span className={styles.value}>123</span><br/>
              Jump directly to the specified results page.
            </div>
            <div className={styles.helpCell}>
              <span className={styles.key}>imgtype</span>:<span className={styles.value}>[jpg|png|gif]</span><br/>
              Search only images of a specific type (JPG, PNG or GIF). This option may be used multiple times in one query.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SearchFilters.displayName = 'SearchFilters';

export default React.memo(SearchFilters);
