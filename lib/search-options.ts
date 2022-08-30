import Router from 'next/router';
import {
  ASPECTS,
  AspectType,
  OrderByType,
  ORDERS,
  OrderType,
  ORDER_BY_FIELDS,
  PageSizeType,
  PAGE_SIZES,
  ResolutionOperatorType,
  RESOLUTIONS,
  ResolutionType,
  RESOLUTION_OPERATORS,
} from '@/lib/types';
import { Board, Purity } from '@/lib/constants';

export interface SearchOptions {
  boards: number;
  purity: number;
  resolution: ResolutionType;
  resolutionOp: ResolutionOperatorType;
  aspect: AspectType;
  page: number;
  pageSize: PageSizeType;
  orderBy: OrderByType;
  order: OrderType;
  query: string;
}

export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  boards: Board.ALL,
  purity: Purity.SFW | Purity.SKETCHY,
  resolution: '',
  resolutionOp: 'gt',
  aspect: '',
  page: 1,
  pageSize: 24,
  orderBy: 'relevancy',
  order: 'desc',
  query: '',
};

/**
 * Extracts search options from the parsed query string.
 * The function doesn't assign invalid values.
 */
export function getSearchOptionsFromQuery(
  q: Record<string, string | string[] | undefined>,
): Partial<SearchOptions> {
  const so: Partial<SearchOptions> = {};
  if (typeof q.boards === 'string') {
    const boards = parseInt(q.boards, 10);
    if (boards > 0 && (boards & ~Board.ALL) === 0) so.boards = boards;
  }
  if (typeof q.purity === 'string') {
    const purity = parseInt(q.purity, 10);
    if (purity > 0 && (purity & ~Purity.ALL) === 0) so.purity = purity;
  }
  if (
    typeof q.resolution === 'string' &&
    (RESOLUTIONS as readonly string[]).includes(q.resolution)
  ) {
    so.resolution = q.resolution as ResolutionType;
  }
  if (
    typeof q.resolutionOp === 'string' &&
    (RESOLUTION_OPERATORS as readonly string[]).includes(q.resolutionOp)
  ) {
    so.resolutionOp = q.resolutionOp as ResolutionOperatorType;
  }
  if (
    typeof q.aspect === 'string' &&
    (ASPECTS as readonly string[]).includes(q.aspect)
  ) {
    so.aspect = q.aspect as AspectType;
  }
  if (typeof q.page === 'string' && parseInt(q.page, 10) >= 1) {
    so.page = parseInt(q.page, 10);
  }
  if (
    typeof q.pageSize === 'string' &&
    (PAGE_SIZES as readonly string[]).includes(q.pageSize)
  ) {
    so.pageSize = parseInt(q.pageSize, 10) as PageSizeType;
  }
  if (
    typeof q.orderBy === 'string' &&
    (ORDER_BY_FIELDS as readonly string[]).includes(q.orderBy)
  ) {
    so.orderBy = q.orderBy as OrderByType;
  }
  if (
    typeof q.order === 'string' &&
    (ORDERS as readonly string[]).includes(q.order)
  ) {
    so.order = q.order as OrderType;
  }
  if (typeof q.query === 'string') so.query = q.query;
  return so;
}

/**
 * Updates the address in the navigator's search bar without page reload.
 */
export function updateLocationSearchOptions(so: SearchOptions) {
  Router.push(
    {
      // the document still reloads without this
      pathname: Router.pathname,
      query: so as unknown as Record<string, string | number>,
    },
    undefined,
    // avoid page refresh
    { shallow: true },
  );
}

/**
 * Updates the page query variable in the navigator's search bar without page reload.
 */
 export function updateLocationPage(page: number) {
  Router.push(
    {
      // the document still reloads without this
      pathname: Router.pathname,
      query: {
        ...Router.query,
        page,
      },
    },
    undefined,
    // avoid page refresh
    { shallow: true },
  );
}
