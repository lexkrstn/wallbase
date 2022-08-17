import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';
import JWT, { JwtPayload } from 'jsonwebtoken';
import { TOKEN_MAX_AGE, TOKEN_NAME } from '../interfaces/constants';
import config from './config';

export function setTokenCookie(res: NextApiResponse, token: string): void {
  res.setHeader('Set-Cookie', serialize(TOKEN_NAME, token, {
    maxAge: TOKEN_MAX_AGE,
    httpOnly: false, // no access from js
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax', // not pass to other domains
  }));
}

export function removeTokenCookie(res: NextApiResponse): void {
  res.setHeader('Set-Cookie', serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  }));
}

function parseCookies(req: NextApiRequest) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;
  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie;
  return parse(cookie || '');
}

export function getTokenFromCookie(req: NextApiRequest): string {
  const cookies = parseCookies(req);
  return cookies[TOKEN_NAME];
}

export function getUserIdFromToken(token: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    JWT.verify(token, process.env.SALT!, { subject: 'login' }, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve((decoded as JwtPayload).id);
    });
  });
}

export function issueUserToken(id: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const payload = {
      sub: id,
      exp: Math.floor(Date.now() / 1000) + config.tokenLifeTime,
      iss: config.site.domain,
      aud: config.site.domain,
    };
    JWT.sign(payload, config.secret, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token!);
    });
  });
}
