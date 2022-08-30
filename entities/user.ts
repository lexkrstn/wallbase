/**
 * User role in the context of RBAC.
 */
export type UserRole = 'banned' | 'viewer' | 'uploader' | 'moderator' | 'admin';

/**
 * Represents the registered website visitor.
 */
export default interface User {
  id: string;
  login: string;
  email: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
  visitedAt: Date;
  lastIp: string;
  collectionCount: number;
  avatarVersion: number;
  avatarExt: string;
  cc2: string;
  cc3: string;
  city: string;
  lat: number | null;
  lng: number | null;
  timezone: string;
  uploadCount: string;
  rating: number;
  wallViewCount: number;
  uploadFavCount: number;
  favCount: number;
  createdTagCount: number;
  attachedTagCount: number;
  commentCount: number;
  role: UserRole;
}

/**
 * User interface extended with the passwordHash field.
 */
export type UserWithPassword = User & { passwordHash: string };
