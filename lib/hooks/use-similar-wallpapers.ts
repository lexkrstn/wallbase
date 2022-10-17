import { useEffect, useRef, useState } from 'react';
import Wallpaper from '@/entities/wallpaper';

async function requestSimilars(id: string) {
  const res = await fetch(`/api/wallpapers/${id}/similars`, { method: 'GET' });
  if (!res.ok) {
    if (res.status === 400) {
      const json = await res.json();
      throw new Error(json.error);
    }
    throw new Error(`Failed to load similar wallpapers: ${res.status}`);
  }
  return await res.json() as Wallpaper[];
}

interface Options {
  onError?: (err: unknown) => void;
}

const cache = new Map<string, Wallpaper[]>();

export function useSimilarWallpapers(id: string, { onError }: Options = {}) {
  const loadingRef = useRef(false);
  const [{ wallpapers, loading, error }, setState] = useState({
    wallpapers: [] as Wallpaper[],
    loading: false,
    error: '',
  });

  const load = (wallpapers: Wallpaper[]) => setState({
    wallpapers,
    error: '',
    loading: false,
  });

  useEffect(() => {
    if (loadingRef.current) return;
    if (cache.has(id)) {
      load(cache.get(id)!);
      return;
    }
    loadingRef.current = true;
    setState(state => ({
      ...state,
      loading: true,
    }));
    requestSimilars(id)
      .then(wallpapers => {
        cache.set(id, wallpapers);
        loadingRef.current = false;
        load(wallpapers);
      })
      .catch(err => {
        loadingRef.current = false;
        setState({
          wallpapers: [],
          error: err,
          loading: false,
        });
        if (onError) onError(err);
      });
  }, [id, onError]);

  return { wallpapers, loading, error };
}
