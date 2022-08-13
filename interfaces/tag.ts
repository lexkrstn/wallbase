import Category from "./category";
import { Purity } from "./purity";

export default interface Tag {
  id: string;
  name: string;
  alias: string;
  createdAt: Date;
  creatorId: string;
  categoryId: string;
  description: string;
  wallpaperCount: number;
  favCount: number;
  purity: Purity;
}

export interface TagWithCategory extends Tag {
  category: Category;
}
