import User from './user';
import Wallpaper from './wallpaper';

export const REPORT_TYPES = [
  'low_quality', 'duplicate', 'rule', 'copyright', 'illegal', 'other',
] as const;

export type ReportType = typeof REPORT_TYPES[number];

export interface Report {
  id: string;
  wallpaperId: string;
  userId: string;
  type: ReportType;
  duplicateId: string | null;
  message: string;
  createdAt: Date;

  user?: User;
  wallpaper?: Wallpaper;
  duplicate?: Wallpaper | null;
}

export interface CreateReportDto {
  wallpaperId: string;
  userId: string;
  type: ReportType;
  duplicateId?: string;
  message: string;
}
