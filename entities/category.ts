/**
 * Represents the tag category.
 */
export default interface Category {
  id: string;
  name: string;
  createdAt: Date;
  creatorId: string;
  parentId: string | null;
  tagCount: number;
  description: string;
}
