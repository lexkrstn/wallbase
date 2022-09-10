import {
  getImageAvgColor, getImageDistinctiveColors, getImageSimdata, getImageSize,
} from '@/lib/server/image';
import { findWallpapers, getThumbnailPath, updateWallpaper } from '@/lib/server/wallpapers';

const REPORT_INTERVAL = 10000;

async function recreateImageInfo() {
  let processedCount = 0;
  let lastReportTime = 0;
  for (let page = 1;; page++) {
    const { wallpapers, totalCount } = await findWallpapers({
      page,
      pageSize: 60,
    });
    if (wallpapers.length === 0) {
      console.log('Done ⌛️');
      break;
    }
    for (const wallpaper of wallpapers) {
      if (Date.now() - lastReportTime > REPORT_INTERVAL) {
        console.log(`Processed ${processedCount} of ${totalCount}...`);
        lastReportTime = Date.now();
      }
      const thumbnailPath = getThumbnailPath(wallpaper.id, wallpaper.mimetype);
      const { width, height } = await getImageSize(thumbnailPath);
      await updateWallpaper(wallpaper.id, {
        simdata: await getImageSimdata(thumbnailPath),
        colors: await getImageDistinctiveColors(thumbnailPath, width, height),
        avgColor: await getImageAvgColor(thumbnailPath),
      });
      ++processedCount;
    }
  }
}

recreateImageInfo()
  .then(() => process.exit(0)); // Required in ts-node
