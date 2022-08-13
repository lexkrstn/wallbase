import { NextApiRequest, NextApiResponse } from 'next';
import passport from 'passport';
import nextConnect from 'next-connect';
import { issueUserToken, setTokenCookie } from '../../lib/auth';
import { localStrategy } from '../../lib/passport';
import User from '../../interfaces/user';
import { addUserVisit } from '../../lib/users';

function authenticate(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<User>((resolve, reject) => {
    const middleware = passport.authenticate(
      localStrategy,
      { session: false },
      (err, user: User) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(user);
      },
    );
    middleware(req, res, (err: any) => reject(err ?? new Error('Unknown auth error')));
  });
}

interface Data {
  error?: string;
  token?: string;
}

export default nextConnect()
  .use(passport.initialize())
  .post(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
      const user = await authenticate(req, res);
      const token = await issueUserToken(user.id);
      setTokenCookie(res, token);
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
      await addUserVisit(user.id, ip);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  })
