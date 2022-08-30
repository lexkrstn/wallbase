import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useState } from 'react';
import { SearchOptions } from '@/lib/search-options';
import AspectSelectbox from '@/components/selectboxes/aspect-selectbox';
import OrderBySelectbox from '@/components/selectboxes/order-by-selectbox';
import PageSizeSelectbox from '@/components/selectboxes/page-size-selectbox';
import ResolutionSelectbox from '@/components/selectboxes/resolution-selectbox';
import BoardFilter from '@/components/triple-filters/board-filter';
import PurityFilter from '@/components/triple-filters/purity-filter';
import styles from './search-options-bar.module.scss';

type SearchBarOptions = Pick<SearchOptions, 'boards' | 'purity' | 'resolution'
  | 'resolutionOp' | 'aspect' | 'pageSize' | 'orderBy' | 'order'>;

interface SearchOptionsBarProps {
  /**
   * Default inner state of the component.
   */
  defaultValue: SearchBarOptions;
}

/**
 * Search options bar below the header. It's an uncontrolled React component.
 */
const SearchOptionsBar: FC<SearchOptionsBarProps> = ({ defaultValue }) => {
  const [boards, setBoards] = useState(defaultValue.boards);
  const [purity, setPurity] = useState(defaultValue.purity);
  const [resolution, setResolution] = useState(defaultValue.resolution);
  const [resolutionOp, setResolutionOp] = useState(defaultValue.resolutionOp);
  const [aspect, setAspect] = useState(defaultValue.aspect);
  const [pageSize, setPageSize] = useState(defaultValue.pageSize);
  const [orderBy, setOrderBy] = useState(defaultValue.orderBy);
  const [order, setOrder] = useState(defaultValue.order);
  return (
    <div className={styles.host}>
      <div className={styles.groups}>

        <div className={styles.bundle}>
          <div className={styles.group}>
            <div className={`${styles.label} ${styles.wideOnly}`}>Board</div>
            <div className={styles.item}>
              <BoardFilter
                className={styles.board}
                value={boards}
                onChange={setBoards}
              />
            </div>
          </div>
          <div className={styles.group}>
            <div className={`${styles.label} ${styles.wideOnly}`}>Purity</div>
            <div className={styles.item}>
              <PurityFilter
                className={styles.purity}
                value={purity}
                onChange={setPurity}
              />
            </div>
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.label}>Size</div>
          <div className={styles.item}>
            <ResolutionSelectbox
              value={resolution}
              operator={resolutionOp}
              onChange={setResolution}
              onOperatorChange={setResolutionOp}
            />
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.label}>Ratio</div>
          <div className={styles.item}>
            <AspectSelectbox
              value={aspect}
              onChange={setAspect}
            />
          </div>
        </div>

        <div className={styles.bundle}>
          <div className={styles.group}>
            <div className={styles.label}>Order by</div>
            <div className={styles.item}>
              <OrderBySelectbox
                value={orderBy}
                order={order}
                onChange={setOrderBy}
                onOrderChange={setOrder}
              />
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.label}>Show</div>
            <div className={styles.item}>
              <PageSizeSelectbox
                value={pageSize}
                onChange={setPageSize}
                className={styles.pageSize}
              />
            </div>
          </div>
        </div>

      </div>

      <button type="submit" className={styles.submit}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
    </div>
  );
};

SearchOptionsBar.displayName = 'SearchOptionsBar';

export default React.memo(SearchOptionsBar);
