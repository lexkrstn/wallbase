/**
 * Converts a string literal type from snake case to camel case., e.g.:
 * ```ts
 *   type A = 'snake_case_literal';
 *   type B = CamelCase<A>; // B is now 'snakeCaseLiteral'
 * ```
 */
export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>;

/**
 * A helper for KeysToCamelCase<T>.
 */
type ObjectToCamelCase<T> = T extends Date
  ? T
  : {
    [K in keyof T as CamelCase<string &K>]: T[K] extends Record<string, any>
      ? KeysToCamelCase<T[K]>
      : T[K];
  };

/**
 * Converts each key of an object type T to camel case, e.g.:
 * ```ts
 *   type A = { snake_case_key: boolean };
 *   type B = KeysToCamelCase<A>; // B is { snakeCaseKey: boolean }
 * ```
 */
export type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string &K>]: T[K] extends Array<any>
    ? KeysToCamelCase<T[K][number]>[]
    : ObjectToCamelCase<T[K]>;
};

type UpperCaseLetters = (
  'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' |
  'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' |
  'Y' | 'Z' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
);

/**
 * A helper for SnakeCase<T>
 */
type SnakeCaseSeq<S extends string> = S extends `${infer P1}${infer P2}`
  ? P1 extends UpperCaseLetters
    ? `_${Lowercase<P1>}${SnakeCaseSeq<P2>}`
    : `${P1}${SnakeCaseSeq<P2>}`
  : Lowercase<S>;

/**
 * Converts a string literal type from camel case to snake case, e.g.:
 * ```ts
 *   type A = 'CamelCaseLiteral';
 *   type B = SnakeCase<A>; // B is now 'camel_case_literal'
 * ```
 */
export type SnakeCase<S extends string> = S extends `${infer P1}${infer P2}`
  ? `${Lowercase<P1>}${SnakeCaseSeq<P2>}`
  : Lowercase<S>;

/**
 * A helper for KeysToSnakeCase<T>.
 */
type ObjectToSnakeCase<T> = T extends Date
  ? T
  : {
    [K in keyof T as SnakeCase<string &K>]: T[K] extends Record<string, any>
      ? KeysToSnakeCase<T[K]>
      : T[K];
  };

/**
 * Converts each key of an object type T to camel case, e.g.:
 * ```ts
 *   type A = { camelCaseKey: boolean };
 *   type B = KeysToSnakeCase<A>; // B is { camel_case_key: boolean }
 * ```
 */
export type KeysToSnakeCase<T> = {
  [K in keyof T as SnakeCase<string &K>]: T[K] extends Array<any>
    ? KeysToSnakeCase<T[K][number]>[]
    : ObjectToSnakeCase<T[K]>;
};
