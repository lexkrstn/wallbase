import { NextApiRequest } from 'next';

type ParamLocation = 'body' | 'query' | 'both';

export function getStringParam(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'query',
): string | undefined {
  if (location === 'query') {
    return req.query[name] as string | undefined;
  }
  if (location === 'body') {
    return req.body[name] as string | undefined;
  }
  return (req.query[name] || req.body[name]) as string | undefined;
}

export function getNumericParam(
  req: NextApiRequest,
  name: string,
  location: ParamLocation = 'query',
): number | undefined {
  return parseInt(getStringParam(req, name, location) || '', 10) || undefined;
}

export function getEnumParam<T>(
  req: NextApiRequest,
  name: string,
  values: readonly T[],
  location: ParamLocation = 'query',
): typeof values[number] | undefined {
  const value = getStringParam(req, name, location);
  return value !== undefined && values.includes(value as any as T)
    ? value as any as typeof values[number] | undefined
    : undefined;
}
