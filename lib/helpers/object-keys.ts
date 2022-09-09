import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import { KeysToCamelCase, KeysToSnakeCase } from './type-case';

/**
 * Applies a transformation function to object keys and returns a corresponding
 * transformed object. The function applies the transformation to all nested
 * objects, including those, that are contained in arrays.
 */
export function transformObjectKeys(o: unknown, transform: (name: string) => string): any {
  if (Array.isArray(o)) {
    return o.map(v => transformObjectKeys(v, transform));
  }
  if ((o instanceof Object) && typeof o !== 'string' && !(o instanceof String)) {
    const clone: Record<string, any> = {};
    for (const key of Object.keys(o)) {
      clone[transform(key)] = (o as Record<string, unknown>)[key];
    }
    return clone;
  }
  return o;
}

/**
 * Applies camel case transformation to object keys and returns a corresponding
 * transformed object. The function applies the transformation to all nested
 * objects, including those, that are contained in arrays.
 */
export function camelCaseObjectKeys<T extends Record<string, any>>(o: T): KeysToCamelCase<T> {
  return transformObjectKeys(o, camelCase) as KeysToCamelCase<T>;
}

/**
 * Applies snake case transformation to object keys and returns a corresponding
 * transformed object. The function applies the transformation to all nested
 * objects, including those, that are contained in arrays.
 */
export function snakeCaseObjectKeys<T extends Record<string, any>>(o: T): KeysToSnakeCase<T> {
  return transformObjectKeys(o, snakeCase) as KeysToSnakeCase<T>;
}
