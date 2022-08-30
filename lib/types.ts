export const ASPECTS = ['1.33', '1.25', '1.77', '1.60', '1.70', '2.50', '3.20', '0.99'] as const;

export type AspectType = '' | typeof ASPECTS[number];

export const ORDER_BY_FIELDS = ['relevancy', 'date', 'views', 'favs'] as const;
export const ORDERS = ['asc', 'desc'] as const;

export type OrderByType = typeof ORDER_BY_FIELDS[number];
export type OrderType = typeof ORDERS[number];

export const PAGE_SIZES = ['12', '24', '36', '48', '60'] as const;

export type PageSizeType = 12 | 24 | 36 | 48 | 60;
export type PageSizeTypeString = typeof PAGE_SIZES[number];

export const STANDARD_RESOLUTIONS = [
  '800x600', '1024x768', '1280x960', '1280x1024',
  '1400x1050', '1600x1200', '2560x2048',
] as const;

export const WIDE_RESOLUTIONS = [
  '1024x600', '1280x800', '1366x768', '1440x900', '1600x900', '1680x1050',
  '1920x1080', '1920x1200', '2560x1440', '2560x1600',
] as const;

export const RESOLUTIONS = [...STANDARD_RESOLUTIONS, ...WIDE_RESOLUTIONS] as const;

export const RESOLUTION_OPERATORS = ['eq', 'gt'] as const;

export type ResolutionOperatorType = typeof RESOLUTION_OPERATORS[number];
export type ResolutionType = ''
  | typeof STANDARD_RESOLUTIONS[number]
  | typeof WIDE_RESOLUTIONS[number];
