import Wallpaper from '@/entities/wallpaper';
import { useDeleteWallpaper } from '@/lib/hooks/use-delete-wallpaper';
import { useCallback, useState } from 'react';
import DeleteWallpaperModal from './delete-wallpaper-modal';

type Options = Parameters<typeof useDeleteWallpaper>[0];

interface State {
  shown: boolean;
  wallpaper?: Wallpaper;
}

export function useDeleteWallpaperModal(options: Options = {}) {
  const [{ shown, wallpaper }, setState] = useState<State>({
    shown: false,
  });

  const close = () => {
    if (processing) return;
    setState({
      shown: false,
      wallpaper: undefined,
    });
  };

  const show = (wallpaper: Wallpaper) => {
    reset();
    setState({
      shown: true,
      wallpaper,
    });
  };

  const { deleteWallpaper, processing, error, reset } = useDeleteWallpaper({
    ...options,
    onSuccess: id => {
      close();
      if (options.onSuccess) {
        options.onSuccess(id);
      }
    },
  });

  const handleConfirm = useCallback(() => deleteWallpaper(wallpaper!.id), [wallpaper?.id]);

  const jsx = (
    <DeleteWallpaperModal
      shown={shown}
      onClose={close}
      onConfirm={handleConfirm}
      wallpaper={wallpaper}
      busy={processing}
      error={error}
    />
  );

  return { shown, jsx, close, show, processing, error };
}
