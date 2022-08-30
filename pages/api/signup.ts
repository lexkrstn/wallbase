import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z from 'zod';
import { createUser, isFirstUserRegistration, setupRootUser } from '@/lib/server/users';
import { issueUserToken, setTokenCookie } from '@/lib/server/auth';
import User from '@/entities/user';
import { addUserVisit } from '@/lib/server/users';

type Data = { token: string, user: User } | { error: string };

const schema = z.object({
  login: z.string().min(5).max(255),
  password: z.string().min(5).max(255),
  email: z.string().email(),
});

export default nextConnect()
  .post(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
      const dto = schema.parse(req.body);
      const user = await isFirstUserRegistration()
        ? await setupRootUser(dto)
        : await createUser(dto);
      const token = await issueUserToken(user.id);
      setTokenCookie(res, token);
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
      await addUserVisit(user.id, ip);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : `${error}` });
    }
  });
