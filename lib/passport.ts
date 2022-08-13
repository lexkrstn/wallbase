import passport from 'passport';
import Local from 'passport-local';
import { findUserByLoginOrEmail, hashPassword } from './users';

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
