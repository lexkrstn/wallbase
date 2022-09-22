import { makeQueryString } from "@/lib/helpers/query-string";
import { omitDefaultSearchOptions, SearchOptions } from "@/lib/search-options";
import { getWallpaperPageUrl } from "./wallpaper";

export default interface SiblingWallpaper {
  id: string;
  page: number;
}

export function getSiblingWallpaperPageUrl(
  sibling: SiblingWallpaper | null,
  so: Partial<SearchOptions>,
) {
  if (!sibling) return '';
  return (
    getWallpaperPageUrl(sibling.id) +
    '?' +
    makeQueryString(omitDefaultSearchOptions({ ...so, page: sibling.page }))
  );
}
