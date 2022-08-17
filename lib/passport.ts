import Local from 'passport-local';
import Jwt from 'passport-jwt';
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
  jwtFromRequest: Jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
  issuer: config.site.domain,
  audience: config.site.domain,
};

export const jwtStrategy = new Jwt.Strategy(jwtOpts, (jwtPayload, done) => {
  findUserById(jwtPayload.sub)
    .then(user => done(null, user))
    .catch(error => done(error));
});
