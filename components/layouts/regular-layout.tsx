import React, { FC, ReactNode, useCallback, useState } from 'react';
import Router from 'next/router';
import { BOARD_ALL, PURITY_SFW, PURITY_SKETCHY } from '../../interfaces/constants';
import User from '../../interfaces/user';
import { makeQueryString } from '../../lib/helpers/make-query-string';
import SearchOptionsBar from '../search-options-bar';
import { AspectType } from '../selectboxes/aspect-selectbox';
import { OrderByType, OrderType } from '../selectboxes/order-by-selectbox';
import { PageSizeType } from '../selectboxes/page-size-selectbox';
import { ResolutionOperatorType, ResolutionType } from '../selectboxes/resolution-selectbox';
import Footer from './elements/footer';
import Header from './elements/header';
import Userbar from './elements/userbar';
import styles from './regular-layout.module.scss';

interface RegularLayoutProps {
  children: ReactNode;
  user: User | null;
  userLoading: boolean;
}

const RegularLayout: FC<RegularLayoutProps> = ({ children, user, userLoading }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState(BOARD_ALL);
  const [purity, setPurity] = useState(PURITY_SFW | PURITY_SKETCHY);
  const [resolution, setResolution] = useState<ResolutionType>('');
  const [resolutionOp, setResolutionOp] = useState<ResolutionOperatorType>('gt');
  const [aspect, setAspect] = useState<AspectType>('');
  const [pageSize, setPageSize] = useState<PageSizeType>(24);
  const [orderBy, setOrderBy] = useState<OrderByType>('relevancy');
  const [order, setOrder] = useState<OrderType>('desc');
  const formData: Record<string, string | number> = {
    boards, purity, resolution, resolutionOp, aspect, pageSize,
    orderBy, order, query,
  };

  const submitSearchForm = useCallback(
    () => Router.push(`/wallpapers?${makeQueryString(formData)}`),
    [JSON.stringify(formData)],
  );

  return (
    <div className={styles.host}>
      <Userbar user={user} userLoading={userLoading} wide docked />
      <Header
        searchOpen={searchOpen}
        onSearchOpen={setSearchOpen}
        onSearchSubmit={submitSearchForm}
        onQueryChange={setQuery}
        query={query}
      />
      {searchOpen && (
        <SearchOptionsBar
          boards={boards}
          onBoardsChange={setBoards}
          purity={purity}
          onPurityChange={setPurity}
          resolution={resolution}
          onResolutionChange={setResolution}
          resolutionOp={resolutionOp}
          onResolutionOpChange={setResolutionOp}
          aspect={aspect}
          onAspectChange={setAspect}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          orderBy={orderBy}
          onOrderByChange={setOrderBy}
          order={order}
          onOrderChange={setOrder}
          onSubmitClick={submitSearchForm}
        />
      )}
      <main className={styles.main + ' ' + styles.center}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

RegularLayout.displayName = 'RegularLayout';

export default RegularLayout;
