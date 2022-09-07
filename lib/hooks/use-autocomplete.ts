import { useCallback, useState } from 'react';
import { asyncDebounce } from '@/lib/helpers/async-debounce';

interface UseAutocompleteOptions<T> {
  fetcher: (query: string) => Promise<T[]>;
  debounceMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  onLoaded?: (list: T[]) => void;
  onError?: (error: any) => void;
}

export function useAutocomplete<T>({
  fetcher,
  onLoaded,
  onError,
  debounceMs = 500,
  maxRetries = 5,
  retryDelayMs = 1000,
}: UseAutocompleteOptions<T>) {
  const [{ list, error, loading }, setResult] = useState({
    list: null as T[] | null,
    error: '',
    loading: false,
  });

  const changeQuery = useCallback(asyncDebounce(async (query: string) => {
    const retry = async (retryNo = 0): Promise<void> => {
      try {
        setResult(result => ({
          ...result,
          loading: true,
        }));
        const newList = await fetcher(query);
        setResult({
          list: newList,
          error: '',
          loading: false,
        });
        if (onLoaded) {
          onLoaded(newList);
        }
      } catch (err: any) {
        if (retryNo + 1 >= maxRetries) {
          setResult({
            error: (err.message || err) as string,
            list: null,
            loading: false,
          });
          if (onError) {
            onError(err);
          }
          return;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        return retry(retryNo + 1);
      }
    };
    return retry();
  }, debounceMs), [fetcher, debounceMs, maxRetries, retryDelayMs, onLoaded, onError]);

  return { list, error, loading, changeQuery };
}
