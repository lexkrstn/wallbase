import React, { FC, useState } from 'react';
import {
  AspectType,
  OrderByType,
  OrderType,
  ResolutionOperatorType,
  ResolutionType,
  PageSizeType,
} from '@/lib/types';
import OrderBySelectbox from '@/components/selectboxes/order-by-selectbox';
import ResolutionSelectbox from '@/components/selectboxes/resolution-selectbox';
import AspectSelectbox from '@/components/selectboxes/aspect-selectbox';
import PageSizeSelectbox from '@/components/selectboxes/page-size-selectbox';
import BoardFilter from '@/components/triple-filters/board-filter';
import PurityFilter from '@/components/triple-filters/purity-filter';
import { Board, Purity } from '@/lib/constants';
import styles from './search-controls-triptych.module.scss';

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
  const [boards, setBoards] = useState(Board.ALL);
  const [purity, setPurity] = useState(Purity.SFW | Purity.SKETCHY);

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
