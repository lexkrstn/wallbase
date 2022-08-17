import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../interfaces/user';
import { getTokenFromCookie, getUserIdFromToken } from '../../lib/auth';
import { findUserById } from '../../lib/users';

interface Data {
  user: User | null;
}

export default async function user(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const token = getTokenFromCookie(req);
    const id = token && await getUserIdFromToken(token);
    const user = id ? await findUserById(id) : null;
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).end('Authentication token is invalid, please log in');
  }
}
