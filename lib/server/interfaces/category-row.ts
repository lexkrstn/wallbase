/**
 * Tag record in the DB.
 */
export interface CategoryRow {
  id: string;
  creator_id: string;
  parent_id: string | null;
  name: string;
  created_at: Date;
  tag_count: number;
  description: string;
}
