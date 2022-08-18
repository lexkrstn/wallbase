import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import User from '../../interfaces/user';
import { jwtStrategy } from '../../lib/passport';

interface Data {
  user: User | null;
}

export default nextConnect()
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .get(function user(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(200).json({ user: (req as any).user });
  });
