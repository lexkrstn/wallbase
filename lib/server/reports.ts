import uniq from 'lodash/uniq';
import { Report, ReportType } from '@/entities/report';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@/lib/helpers/object-keys';
import knex from './knex';
import { findWallpapersById } from './wallpapers';
import { findUsersById } from './users';
import { wrapError } from 'db-errors';

/**
 * Incomplete type definition of the Tag record in DB.
 */
interface ReportRow {
  id: string;
  [k: string]: unknown;
}

function dbRowToReport(row: ReportRow): Report {
  return camelCaseObjectKeys(row) as Report;
}

function reportToDbRow(row: Partial<Report>): ReportRow {
  return snakeCaseObjectKeys(row) as ReportRow;
}

/**
 * Loads wallpaper fields for the reports and returns a copy of the
 * original array with 'wallpaper' field filled up.
 */
 export async function injectReportWallpapers(reports: Report[]) {
  const ids = reports.map(r => r.wallpaperId);
  if (ids.length === 0) return reports;
  const wallpapers = await findWallpapersById(uniq(ids));
  return reports.map(r => ({
    ...r,
    wallpaper: wallpapers.find(w => w.id === r.wallpaperId),
  }));
}

/**
 * Loads wallpaper duplicate fields for the reports and returns a copy of the
 * original array with 'duplicate' field filled up.
 */
export async function injectReportDuplicates(reports: Report[]) {
  const ids = reports
    .filter(r => r.duplicateId)
    .map(r => r.duplicateId) as string[];
  if (ids.length === 0) return reports;
  const duplicates = await findWallpapersById(uniq(ids));
  return reports.map(r => ({
    ...r,
    duplicate: duplicates.find(d => d.id === r.duplicateId),
  }));
}

/**
 * Loads 'user' fields for the reports and returns a copy of the
 * original array with 'user' field filled up.
 */
export async function injectReportUsers(reports: Report[]) {
  const ids = reports.map(r => r.userId);
  if (ids.length === 0) return reports;
  const users = await findUsersById(uniq(ids));
  return reports.map(r => ({
    ...r,
    user: users.find(u => u.id === r.userId),
  }));
}

interface FindReportsOptions {
  wallpaperId?: string;
  pageSize?: number;
  page?: number;
  order?: 'asc' | 'desc',
  withWallpaper?: boolean;
  withDuplicate?: boolean;
  withUser?: boolean;
}

/**
 * Searches in DB for the wallpaper reports (aka complaints).
 */
export async function findReports({
  page = 1,
  pageSize = 24,
  order = 'asc',
  withDuplicate = false,
  withUser = false,
  withWallpaper = false,
  wallpaperId,
}: FindReportsOptions = {}) {
  const qb = knex('reports');
  if (wallpaperId) {
    qb.where('wallpaper_id', wallpaperId);
  }
  const [{ count }] = await qb.clone().count();
  const rows = await qb
    .orderBy('createdAt', order)
    .offset((page - 1) * pageSize)
    .limit(pageSize);
  let reports = rows.map(dbRowToReport);
  if (withDuplicate) {
    reports = await injectReportDuplicates(reports);
  }
  if (withUser) {
    reports = await injectReportUsers(reports);
  }
  if (withWallpaper) {
    reports = await injectReportWallpapers(reports);
  }
  return {
    reports,
    totalCount: parseInt(`${count}`, 10),
  };
}

interface CreateReportDto {
  wallpaperId: string;
  userId: string;
  type: ReportType;
  duplicateId?: string;
  message: string;
}

/**
 * Inserts a new wallpaper report (complaint) into DB.
 */
export async function createReport(dto: CreateReportDto) {
  try {
    const rows = await knex('reports')
      .insert(reportToDbRow(dto))
      .returning('*');
    return dbRowToReport(rows[0]);
  } catch (err) {
    throw wrapError(err as Error);
  }
}
