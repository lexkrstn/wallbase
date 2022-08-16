import Category from "./category";

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
  purity: number;
}

export interface TagWithCategory extends Tag {
  category: Category;
}
