import { NextApiRequest, NextApiResponse } from 'next';
import { removeTokenCookie } from '@/lib/server/auth';

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  removeTokenCookie(res);
  res.status(302).setHeader('Location', '/').end();
}
