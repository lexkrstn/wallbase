import { useCallback, useState } from 'react';
import AboutWallpaperIssuesModal from './about-wallpaper-issues-modal';

export function useAboutWallpaperIssuesModal() {
  const [shown, setShown] = useState(false);

  const close = useCallback(() => setShown(false), []);

  const jsx = (
    <AboutWallpaperIssuesModal
      shown={shown}
      onClose={close}
    />
  );

  return {
    shown,
    jsx,
    show: () => setShown(true),
  };
}
