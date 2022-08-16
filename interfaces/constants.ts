export const BOARD_G = 1 << 0;
export const BOARD_A = 1 << 1;
export const BOARD_P = 1 << 2;
export const BOARD_ALL = BOARD_A | BOARD_G | BOARD_P;

export const PURITY_SFW = 1 << 0;
export const PURITY_SKETCHY = 1 << 1;
export const PURITY_NSFW = 1 << 2;
export const PURITY_ALL = PURITY_SFW | PURITY_SKETCHY | PURITY_NSFW;

export const TOKEN_NAME = 'token';
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
