export default interface Wallpaper {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  uploaderId: string;
  mimetype: string;
  ext: string;
  fileSize: number;
  width: number;
  height: number;
  sourceUrl: string;
  authorName: string;
  authorUrl: string;
  tagCount: number;
  viewCount: number;
  favCount: number;
  favCount1d: number;
  favCount1w: number;
  favCount1m: number;
  purity: number;
  board: number;
  ratio: number;
  rgb4x4: number[];
  colors: number[];
  avgColor: number[];
  sha256: string;
  featured: boolean;
}
