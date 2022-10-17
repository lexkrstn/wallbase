export const REPORT_TYPES = [
  'low_quality', 'duplicate', 'rule', 'copyright', 'illegal', 'other',
] as const;

export type ReportType = typeof REPORT_TYPES[number];

/**
 * Wallpaper rule violation record in the DB.
 */
export interface ReportRow {
  id: string;
  wallpaper_id: string;
  user_id: string;
  type: ReportType;
  duplicate_id: string | null;
  message: string;
  created_at: Date;
}
