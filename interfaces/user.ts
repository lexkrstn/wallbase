export type UserRole = 'banned' | 'viewer' | 'uploader' | 'moderator' | 'admin';

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

export type UserWithPassword = User & { passwordHash: string };
