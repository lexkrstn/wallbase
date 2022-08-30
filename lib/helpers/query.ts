import { NextApiRequest } from 'next';

type ParamLocation = 'body' | 'query' | 'both';

export function getParam<T>(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'both',
): T | undefined {
  if (location === 'query') {
    return req.query[name] as any as T | undefined;
  }
  if (location === 'body' && req.body) {
    return req.body[name] as T | undefined;
  }
  return (req.query[name] || (req.body ? req.body[name] : undefined)) as T | undefined;
}

export function getStringParam(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'both',
): string | undefined {
  return getParam<string>(req, name, location);
}

export function getNumericParam(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'both',
  { min, max }: { min?: number, max?: number } = {},
): number | undefined {
  const number = parseInt(getStringParam(req, name, location) || '', 10) || undefined;
  if (number === undefined) return number;
  if (min !== undefined && number < min) return undefined;
  if (max !== undefined && number > max) return undefined;
  return number;
}

export function getEnumParam<T>(
  req: NextApiRequest,
  name: string,
  values: readonly T[],
  location: ParamLocation = 'both',
): typeof values[number] | undefined {
  const value = getStringParam(req, name, location);
  return value !== undefined && values.includes(value as any as T)
    ? value as any as typeof values[number] | undefined
    : undefined;
}

export function getArrayParam<T>(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'both',
) {
  const value = getParam<unknown>(req, name, location);
  if (Array.isArray(value)) {
    return value as T[];
  }
  return `${value}`.split(',');
}
