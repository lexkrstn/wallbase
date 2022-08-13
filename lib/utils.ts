import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';

export function camelCaseObjectKeys(obj: Record<any, any>): Record<any, any> {
  const clone: Record<any, any> = {};
  for (const key of Object.keys(obj)) {
    clone[camelCase(key)] = obj[key];
  }
  return clone;
}

export function kebabCaseObjectKeys(obj: Record<any, any>): Record<any, any> {
  const clone: Record<any, any> = {};
  for (const key of Object.keys(obj)) {
    clone[kebabCase(key)] = obj[key];
  }
  return clone;
}
