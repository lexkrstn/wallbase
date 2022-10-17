import { KeysToCamelCase } from '@/lib/helpers/type-case';
import { ReportRow, ReportType } from '@/lib/server/interfaces';
import User from './user';
import Wallpaper from './wallpaper';

export { REPORT_TYPES } from '@/lib/server/interfaces';
export type { ReportType } from '@/lib/server/interfaces';

/**
 * Wallpaper rule violation report.
 */
export interface Report extends KeysToCamelCase<ReportRow> {
  user?: User;
  wallpaper?: Wallpaper;
  duplicate?: Wallpaper | null;
}

/**
 * Wallpaper rule violation report creation DTO.
 */
export interface ReportCreateDto {
  wallpaperId: string;
  userId: string;
  type: ReportType;
  duplicateId?: string;
  message: string;
}
