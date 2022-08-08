import React, { FC, useCallback, useState } from 'react';
import OrderBySelectbox, { OrderByType, OrderType } from '../selectboxes/order-by-selectbox';
import ResolutionSelectbox, {
  ResolutionOperatorType,
  ResolutionType,
} from '../selectboxes/resolution-selectbox';
import AspectSelectbox, { AspectType } from '../selectboxes/aspect-selectbox';
import PageSizeSelectbox, { PageSizeType } from '../selectboxes/page-size-selectbox';
import BoardFilter from '../triple-filters/board-filter';
import PurityFilter from '../triple-filters/purity-filter';
import styles from './search-controls-triptych.module.scss';
import { BOARD_A, BOARD_G, BOARD_P, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';

export interface SearchControlsTriptychData {
  purity: number;
  boards: number;
  aspect: AspectType;
  pageSize: PageSizeType;
  orderBy: OrderByType;
  order: OrderType;
  resolutionOp: ResolutionOperatorType;
  resolution: ResolutionType;
}

interface SearchControlsTriptychProps {

}

const SearchControlsTriptych: FC<SearchControlsTriptychProps> = () => {
  const [aspect, setAspect] = useState<AspectType>('');
  const [pageSize, setPageSize] = useState<PageSizeType>(24);
  const [orderBy, setOrderBy] = useState<OrderByType>('relevancy');
  const [order, setOrder] = useState<OrderType>('desc');
  const [resolutionOp, setResolutionOp] = useState<ResolutionOperatorType>('gt');
  const [resolution, setResolution] = useState<ResolutionType>('');
  const [boards, setBoards] = useState(BOARD_A | BOARD_G | BOARD_P);
  const [purity, setPurity] = useState(PURITY_SFW | PURITY_SKETCHY);

  return (
    <div className={styles.host}>

      <div className={styles.fold}>
        <div className={styles.field}>
          <div className={styles.label}>Category / Board</div>
          <BoardFilter value={boards} onChange={setBoards} />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Order by</div>
          <OrderBySelectbox
            onChange={setOrderBy}
            onOrderChange={setOrder}
            value={orderBy}
            order={order}
          />
        </div>
      </div>

      <div className={styles.fold}>
        <div className={styles.field}>
          <div className={styles.label}>Resolution</div>
          <ResolutionSelectbox
            onChange={setResolution}
            onOperatorChange={setResolutionOp}
            value={resolution}
            operator={resolutionOp}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Aspect ratio</div>
          <AspectSelectbox onChange={setAspect} value={aspect} />
        </div>
      </div>

      <div className={styles.fold}>
        <div className={styles.field}>
          <div className={styles.label}>Purity filter</div>
          <PurityFilter value={purity} onChange={setPurity} />
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Thumbs per page</div>
          <PageSizeSelectbox onChange={setPageSize} value={pageSize} />
        </div>
      </div>
    </div>
  );
};

SearchControlsTriptych.displayName = 'SearchControlsTriptych';

export default SearchControlsTriptych;
