export const TOKEN_NAME = 'token';
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export enum Purity {
  SFW = 1 << 0,
  SKETCHY = 1 << 1,
  NSFW = 1 << 2,
  ALL = SFW | SKETCHY | NSFW,
};

export enum Board {
  G = 1 << 0,
  A = 1 << 1,
  P = 1 << 2,
  ALL = G | A | P,
};
