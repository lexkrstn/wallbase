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
  if (location === 'body') {
    return req.body[name] as T | undefined;
  }
  return (req.query[name] || req.body[name]) as T | undefined;
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
): number | undefined {
  return parseInt(getStringParam(req, name, location) || '', 10) || undefined;
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
