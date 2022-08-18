import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import AspectSelectbox, { AspectType } from '../selectboxes/aspect-selectbox';
import OrderBySelectbox, { OrderByType, OrderType } from '../selectboxes/order-by-selectbox';
import PageSizeSelectbox, { PageSizeType } from '../selectboxes/page-size-selectbox';
import ResolutionSelectbox, {
  ResolutionOperatorType, ResolutionType,
} from '../selectboxes/resolution-selectbox';
import BoardFilter from '../triple-filters/board-filter';
import PurityFilter from '../triple-filters/purity-filter';
import styles from './search-options-bar.module.scss';

interface SearchOptionsBarProps {
  boards: number;
  onBoardsChange: (boards: number) => void;
  purity: number;
  onPurityChange: (purity: number) => void;
  resolution: ResolutionType;
  onResolutionChange: (resolution: ResolutionType) => void;
  resolutionOp: ResolutionOperatorType;
  onResolutionOpChange: (op: ResolutionOperatorType) => void;
  aspect: AspectType;
  onAspectChange: (aspect: AspectType) => void;
  pageSize: PageSizeType;
  onPageSizeChange: (pageSize: PageSizeType) => void;
  orderBy: OrderByType;
  onOrderByChange: (orderBy: OrderByType) => void;
  order: OrderType;
  onOrderChange: (order: OrderType) => void;
  onSubmitClick?: () => void;
}

const SearchOptionsBar: FC<SearchOptionsBarProps> = ({
  boards, onBoardsChange, purity, onPurityChange, resolution,
  onResolutionChange, resolutionOp, onResolutionOpChange, aspect, onAspectChange,
  pageSize, onPageSizeChange, order, onOrderChange, orderBy, onOrderByChange,
  onSubmitClick,
}) => {
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
                onChange={onBoardsChange}
              />
            </div>
          </div>
          <div className={styles.group}>
            <div className={`${styles.label} ${styles.wideOnly}`}>Purity</div>
            <div className={styles.item}>
              <PurityFilter
                className={styles.purity}
                value={purity}
                onChange={onPurityChange}
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
              onChange={onResolutionChange}
              onOperatorChange={onResolutionOpChange}
            />
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.label}>Ratio</div>
          <div className={styles.item}>
            <AspectSelectbox
              value={aspect}
              onChange={onAspectChange}
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
                onChange={onOrderByChange}
                onOrderChange={onOrderChange}
              />
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.label}>Show</div>
            <div className={styles.item} id="limit">
              <PageSizeSelectbox
                value={pageSize}
                onChange={onPageSizeChange}
                className={styles.pageSize}
              />
            </div>
          </div>
        </div>

      </div>

      <button type="button" className={styles.submit} onClick={onSubmitClick}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
    </div>
  );
};

SearchOptionsBar.displayName = 'SearchOptionsBar';

export default React.memo(SearchOptionsBar);
