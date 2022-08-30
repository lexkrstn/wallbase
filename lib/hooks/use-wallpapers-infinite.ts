import useSWRInfinite from 'swr/infinite';
import { makeQueryString } from '@/lib/helpers/query-string';
import Wallpaper from '@/entities/wallpaper';
import { SearchOptions } from '../search-options';
import { useRef } from 'react';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
  const wallpapers = await response.json() as Wallpaper[];
  return {
    wallpapers,
    totalCount: parseInt(response.headers.get('x-total-count') ?? '0', 10),
  };
};

export function useWallpapersInfinite(searchOptions: SearchOptions) {
  const firstPage = useRef(searchOptions.page);

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    index => {
      const qs = makeQueryString({
        ...searchOptions,
        page: firstPage.current + index,
      });
      return `/api/wallpapers?${qs}`;
    },
    fetcher,
  );

  const wallpapers: Wallpaper[] = data
    ? data.flatMap(d => d.wallpapers)
    : [];
  const isLoading = !!((!data && !error) || (size > 0 && data && !data[size - 1]));
  const isEmpty = wallpapers?.length === 0;
  const isReachingEnd = isEmpty
    || !!(data && data[data.length - 1]?.wallpapers.length < searchOptions.pageSize);
  const isRefreshing = !!(isValidating && data && data.length === size);
  const totalCount = data && data.length > 0 ? data[0].totalCount : undefined;
  const totalPages = totalCount && Math.ceil(totalCount / searchOptions.pageSize);

  const loadMore = (cb?: (page: number, numPages: number) => void) => {
    setSize(oldSize => {
      const newSize = oldSize + 1;
      if (cb) {
        cb(firstPage.current + oldSize, newSize);
      }
      return newSize;
    });
  };

  const reload = () => {
    firstPage.current = 1;
    setSize(0);
  };

  const removeWallpaper = (id: string) => {
    mutate((oldData) => {
      return oldData?.map(dataPage => ({
        ...dataPage,
        wallpapers: dataPage.wallpapers.filter(w => w.id !== id),
      }));
    });
  };

  return {
    wallpapers,
    isLoading,
    isEmpty,
    isReachingEnd,
    isRefreshing,
    totalCount,
    firstPage: firstPage.current,
    pages: data?.map(d => d.wallpapers),
    totalPages,
    loadMore,
    reload,
    removeWallpaper,
  }
}
