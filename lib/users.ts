import crypto from 'crypto';
import { wrapError } from 'db-errors';
import omit from 'lodash/omit';
import User, { UserRole, UserWithPassword } from '../interfaces/user';
import knex from './knex';
import { camelCaseObjectKeys, kebabCaseObjectKeys } from './utils';

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
        ...kebabCaseObjectKeys(dto),
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
 export async function getUser(id: string): Promise<User | null> {
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
 export async function findUserByLoginOrEmail(
  loginOrEmail: string,
): Promise<UserWithPassword | null> {
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
}: UserSearchOptions): Promise<{ users: User[]; totalPages: number }> {
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
  const user = await getUser(ROOT_USER_ID);
  if (user) return true;
  await createUser({
    login: 'admin',
    email: 'admin@wallbase.net',
    password: process.env.ADMIN_PASSWORD ?? 'admin',
    activated: true,
  });
  return false;
}
