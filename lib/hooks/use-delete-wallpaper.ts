import { useState } from 'react';
import { getAuthTokenHeaders } from '../helpers/browser-auth-token';

async function requestDelete(id: string) {
  const res = await fetch(`/api/wallpapers/${id}`, {
    method: 'DELETE',
    headers: getAuthTokenHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to send delete wallpaper request: ${res.status}`);
  }
}

interface Options {
  onError?: (error: unknown, id: string) => void;
  onSuccess?: (id: string) => void;
  onComplete?: (error: unknown, id: string) => void;
}

export function useDeleteWallpaper({ onError, onSuccess, onComplete }: Options = {}) {
  const [{ error, processing }, setState] = useState({
    error: '',
    processing: false,
  });

  const reset = () => {
    setState({
      error: '',
      processing: false,
    });
  };

  const deleteWallpaper = async (id: string) => {
    setState({
      error: '',
      processing: true,
    });
    try {
      await requestDelete(id);
      reset();
      if (onSuccess) onSuccess(id);
      if (onComplete) onComplete(null, id);
    } catch (err) {
      setState({
        error: err instanceof Error ? err.message : `${err}`,
        processing: false,
      });
      if (onError) onError(err, id);
      if (onComplete) onComplete(err, id);
    }
  };

  return { deleteWallpaper, processing, error, reset };
}
