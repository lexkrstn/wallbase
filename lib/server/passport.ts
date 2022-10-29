import { IncomingMessage } from 'http';
import { Request } from 'express';
import passport from 'passport';
import Local from 'passport-local';
import Jwt from 'passport-jwt';
import User from '@/entities/user';
import { TOKEN_NAME } from '@/lib/constants';
import { findUserById, findUserByLoginOrEmail, hashPassword } from './users';
import config from './config';

export const localStrategy = new Local.Strategy((username, password, done) => {
  findUserByLoginOrEmail(username)
    .then(async user => {
      if (user && user.passwordHash === await hashPassword(password)) {
        done(null, user);
      } else {
        done(new Error('Invalid username and password combination'));
      }
    })
    .catch(error => done(error));
});

const jwtOpts = {
  jwtFromRequest: (req: Request) => {
    const token = Jwt.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (token) return token;
    return req.cookies[TOKEN_NAME];
  },
  secretOrKey: config.secret,
  issuer: config.site.domain,
  audience: config.site.domain,
};

export const jwtStrategy = new Jwt.Strategy(jwtOpts, (jwtPayload, done) => {
  findUserById(jwtPayload.sub)
    .then(user => done(null, user ?? false))
    .catch(error => done(error));
});

export function tryAuthenticateByJwt(req: IncomingMessage) {
  const res = {};
  return new Promise<User | null>((resolve, reject) => {
    passport.authenticate(jwtStrategy, { session: false }, (err, user) => {
      if (err) return reject(err);
      resolve(user || null);
    })(req, res, () => resolve(null));
  });
}
