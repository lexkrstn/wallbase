import crypto from 'crypto';
import { wrapError } from 'db-errors';
import omit from 'lodash/omit';
import geoip from 'geoip-lite';
import countryData from 'country-data';
import User, { UserRole, UserWithPassword } from '@/entities/user';
import knex from '@/lib/server/knex';
import { camelCaseObjectKeys, snakeCaseObjectKeys } from '@/lib/helpers/object-keys';

export const ROOT_USER_ID = '1';

function dbRowToUserWithPassword(row: Record<any, any>): UserWithPassword {
  return camelCaseObjectKeys(row) as UserWithPassword;
}

function dbRowToUser(row: Record<any, any>): User {
  return omit(dbRowToUserWithPassword(row), ['passwordHash']);
}

export async function hashPassword(password: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, process.env.SALT || '', 1000, 64, 'sha512', (err, buf) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(buf.toString('hex'));
    });
  });
}

export interface NewUserDto {
  login: string;
  email: string;
  password: string;
  activated?: boolean;
}

/**
 * Creates user record in DB.
 *
 * @throws { import("db-errors").UniqueViolationError }
 */
export async function createUser({
  login, email, password, activated,
}: NewUserDto): Promise<User> {
  try {
    const rows = await knex('users')
      .insert({
        login,
        email,
        password_hash: await hashPassword(password),
        activated,
      })
      .returning('*');
    return dbRowToUser(rows[0]);
  } catch(err) {
    throw wrapError(err as Error);
  }
}

interface UpdateUserDto {
  login?: string;
  email?: string;
  activated?: boolean;
  visitedAt?: Date;
  lastIp?: string;
  avatarVersion?: number;
  avatarExt?: string;
  cc2?: string;
  cc3?: string;
  rating?: number;
}

/**
 * Updates user record in DB.
 *
 * @param id User ID.
 * @param dto User DTO.
 * @returns True if the user with such ID has been found and updated.
 */
export async function updateUser(id: string, dto: UpdateUserDto): Promise<boolean> {
  try {
    const rows = await knex('users')
      .update({
        ...snakeCaseObjectKeys(dto),
        updated_at: knex.fn.now(),
      })
      .where('id', id)
      .returning('id');
    return rows.length > 0;
  } catch(err) {
    throw wrapError(err as Error);
  }
}

/**
 * Returns user record from DB.
 *
 * @param id User ID.
 * @param dto User DTO.
 * @returns The user record or null.
 */
 export async function findUserById(id: string): Promise<User | null> {
  try {
    const rows = await knex('users')
      .where('id', id)
      .returning('*');
    if (!rows.length) return null;
    return dbRowToUser(rows[0]);
  } catch(err) {
    throw wrapError(err as Error);
  }
}

/**
 * Returns user record by its login or email from DB.
 *
 * @param loginOrEmail User login or email.
 * @returns The user record or null.
 */
 export async function findUserByLoginOrEmail(loginOrEmail: string) {
  try {
    const rows = await knex('users')
      .where('login', loginOrEmail)
      .orWhere('email', loginOrEmail)
      .returning('*');
    if (!rows.length) return null;
    return dbRowToUserWithPassword(rows[0]);
  } catch(err) {
    throw wrapError(err as Error);
  }
}

interface UserSearchOptions {
  page?: number;
  perPage?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'createdAt' | 'updatedAt' | 'visitedAt' | 'uploadCount' | 'rating';
  role?: UserRole;
}

/**
 * Returns user record from DB.
 *
 * @param id User ID.
 * @param dto User DTO.
 * @returns The user record or null.
 */
export async function findUsers({
  page = 1,
  perPage = 24,
  order = 'desc',
  orderBy = 'createdAt',
  role,
}: UserSearchOptions) {
  try {
    let query = knex('users')
      .orderBy(orderBy, order);
    if (role) query = query.where({ role });

    const [{ count }] = await query.clone().count('*');

    const rows = await query
      .offset((page - 1) * perPage)
      .limit(perPage)
      .returning('*');

    return {
      users: rows.map(dbRowToUser),
      totalPages: Math.ceil(parseInt(count + '', 10) / perPage),
    };
  } catch(err) {
    throw wrapError(err as Error);
  }
}

/**
 * Creates new root user if it doesn't exists yet.
 *
 * @returns True if the user existed before.
 */
export async function ensureRootUserCreated(): Promise<boolean> {
  const user = await findUserById(ROOT_USER_ID);
  if (user) return true;
  await createUser({
    login: 'admin',
    email: 'admin@wallbase.net',
    password: process.env.ADMIN_PASSWORD ?? 'admin',
    activated: true,
  });
  return false;
}

interface GeoIpUserData {
  cc2: string;
  cc3: string;
  country: string;
  city: string;
  timezone: string;
  lat: number;
  lng: number;
}

/**
 * Returns geoip fields in the form that is safe to directly assign the whole
 * object to user DB record or business model (User interface).
 */
export function getGeoIpUserData(ip: string): GeoIpUserData | null {
  const geo = geoip.lookup(ip);
  if (!geo) return null;
  const cc2 = geo.country;
  const country = countryData.countries[cc2];
  if (!country) return null;
  return {
    cc2,
    cc3: country.alpha3,
    country: country.name,
    city: geo.city,
    timezone: geo.timezone,
    lat: geo.ll[0],
    lng: geo.ll[1],
  };
}

/**
 * Must be called when user interacts the backend in order to update
 * his/her last visit stats.
 */
export async function addUserVisit(id: string, ip: string): Promise<boolean> {
  const geoIpData = getGeoIpUserData(ip) ?? {};
  const affected = await knex('users')
    .update({
      visited_at: knex.raw('NOW()'),
      last_ip: ip,
      ...geoIpData,
    })
    .where({ id })
    .returning('id');
  return affected.length > 0;
}