import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/lib/server/users';

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  try {
    await createUser(req.body);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).end(error.message);
  }
}
