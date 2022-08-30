import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

export function camelCaseObjectKeys(obj: Record<any, any>): Record<any, any> {
  const clone: Record<any, any> = {};
  for (const key of Object.keys(obj)) {
    clone[camelCase(key)] = obj[key];
  }
  return clone;
}

export function snakeCaseObjectKeys(obj: Record<any, any>): Record<any, any> {
  const clone: Record<any, any> = {};
  for (const key of Object.keys(obj)) {
    clone[snakeCase(key)] = obj[key];
  }
  return clone;
}
