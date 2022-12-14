import padStart from 'lodash/padStart';
import isString from 'lodash/isString';
import { DAY, GB, HOUR, KB, MB, MINUTE, MONTH, TB, WEEK, YEAR } from '../constants';

/**
 * Returns the plural of an English word.
 */
export function plural(word: string, amount?: number): string {
  if (amount !== undefined && amount === 1) {
    return word;
  }
  const plural: { [key: string]: string } = {
    '(quiz)$'               : "$1zes",
    '^(ox)$'                : "$1en",
    '([m|l])ouse$'          : "$1ice",
    '(matr|vert|ind)ix|ex$' : "$1ices",
    '(x|ch|ss|sh)$'         : "$1es",
    '([^aeiouy]|qu)y$'      : "$1ies",
    '(hive)$'               : "$1s",
    '(?:([^f])fe|([lr])f)$' : "$1$2ves",
    '(shea|lea|loa|thie)f$' : "$1ves",
    'sis$'                  : "ses",
    '([ti])um$'             : "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$'                : "$1ses",
    '(alias)$'              : "$1es",
    '(octop)us$'            : "$1i",
    '(ax|test)is$'          : "$1es",
    '(us)$'                 : "$1es",
    '([^s]+)$'              : "$1s",
  }
  const irregular: { [key: string]: string } = {
    'move'   : 'moves',
    'foot'   : 'feet',
    'goose'  : 'geese',
    'sex'    : 'sexes',
    'child'  : 'children',
    'man'    : 'men',
    'tooth'  : 'teeth',
    'person' : 'people',
  }
  const uncountable: string[] = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment',
    'bison',
    'cod',
    'offspring',
    'pike',
    'salmon',
    'shrimp',
    'swine',
    'trout',
    'aircraft',
    'hovercraft',
    'spacecraft',
    'sugar',
    'tuna',
    'you',
    'wood',
  ]
  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(word.toLowerCase()) >= 0) {
    return word;
  }
  // check for irregular forms
  for (const w in irregular) {
    const pattern = new RegExp(`${w}$`, 'i');
    const replace = irregular[w];
    if (pattern.test(word)) {
      return word.replace(pattern, replace);
    }
  }
  // check for matches using regular expressions
  for (const reg in plural) {
    const pattern = new RegExp(reg, 'i');
    if (pattern.test(word)) {
      return word.replace(pattern, plural[reg]);
    }
  }
  return word;
}

const UNIT_AGO_LONG_FORM: Record<string, string> = {
  'y': 'year',
  'mon': 'month',
  'w': 'week',
  'd': 'day',
  'hr': 'hour',
  'm': 'minute',
};

export function formatTimeAgo(
  date: Date | number | string,
  format: 'abbr' | 'long' = 'abbr',
): string {
  let ms: number;
  if (date instanceof Date)
    ms = date.getTime();
  else if (isString(date))
    ms = new Date(date).getTime();
  else
    ms = date;
  const elapsed = Date.now() - ms;
  let time: number;
  let unit: string;
  if (elapsed >= YEAR) {
    time = YEAR;
    unit = 'y';
  } else if (elapsed >= MONTH) {
    time = MONTH;
    unit = 'mon';
  } else if (elapsed >= WEEK) {
    time = WEEK;
    unit = 'w';
  } else if (elapsed >= DAY) {
    time = DAY;
    unit = 'd';
  } else if (elapsed >= HOUR) {
    time = HOUR;
    unit = 'hr';
  } else if (elapsed >= MINUTE) {
    time = MINUTE;
    unit = 'm';
  } else {
    return format === 'abbr' ? '<1m' : 'just now';
  }
  const numUnits =  Math.round(elapsed / time);
  return format === 'abbr'
    ? numUnits + unit
    : numUnits + ' ' + plural(UNIT_AGO_LONG_FORM[unit], numUnits) + ' ago';
}

export function formatK(n: number, fraction: number = 1): string {
  return n > 1000 ? (n / 1000).toFixed(fraction) + 'K' : n + '';
}

export function formatFileSize(n: number, fraction: number = 1): string {
  const TOLERANCE = 0.8;
  const DESCRIPTORS = [
    { size: TB, unit: 'Tb' },
    { size: GB, unit: 'Gb' },
    { size: MB, unit: 'Mb' },
    { size: KB, unit: 'Kb' },
    { size: 0, unit: plural('byte', n) },
  ];
  const { size, unit } = DESCRIPTORS.find(d => Math.abs(n) >= d.size * TOLERANCE)!;
  if (size === 0) return `${n} ${unit}`;
  return `${(n / size).toFixed(fraction)} ${unit}`;
}

function hours24to12(hrs: number): number {
  if (hrs === 0) return 12;
  if (hrs > 12) return hrs - 12;
  return hrs;
}

function isAmHour(hrs: number): boolean {
  return hrs < 12;
}

export function formatTime(date: Date): string {
  const h = padStart(hours24to12(date.getHours()) + '', 2, '0');
  const m = padStart(date.getMinutes() + '', 2, '0');
  const ampm = isAmHour(date.getHours()) ? 'AM' : 'PM';
  return `${h}:${m} ${ampm}`
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(date: Date): string {
  return MONTHS[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

export function thousands(n: number|string, delim = ','): string {
  const regex = /(\d+)(\d{3})/;
  const parts = (n + '').split('.');
  let i = parts[0];
  while (regex.test(i)) {
    i = i.replace(regex, '$1' + delim + '$2');
  }
  return i + (parts.length > 1 ? '.' + parts[1] : '');
}
