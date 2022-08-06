import Category from "./category";

export default interface Tag {
  id: number;
  name: string;
  purity: number;
  count: number;
  category: Category;
}