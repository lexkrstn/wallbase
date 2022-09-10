import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import z, { ZodError } from 'zod';
import Wallpaper, { canDeleteWallpaper } from '@/entities/wallpaper';
import { deleteWallpaper, findWallpaperById, viewWallpaper } from '@/lib/server/wallpapers';
import { jwtStrategy, tryAuthenticateByJwt } from '@/lib/server/passport';
import User from '@/entities/user';

type GetData = { error?: string } | Wallpaper;
type DeleteData = { error?: string } | {};

const schemaGet = z.object({
  id: z.string().uuid(),
});

const schemaDelete = z.object({
  id: z.string().uuid(),
});

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const user = await tryAuthenticateByJwt(req);
      const dto = schemaGet.parse(req.query);
      const wallpaper = await findWallpaperById(dto.id);
      if (!wallpaper) {
        res.status(404).json({ error: 'No such wallpaper' });
        return;
      }
      await viewWallpaper(wallpaper.id, user?.id);
      res.json(wallpaper);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.issues[0].message });
        return;
      }
      console.error(err);
      res.status(500).json({ error: `${err}` });
    }
  })
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .delete(async (req: NextApiRequest, res: NextApiResponse<DeleteData>) => {
    const user = (req as any).user as User;
    try {
      const dto = schemaDelete.parse(req.query);
      const wallpaper = await findWallpaperById(dto.id);
      if (!wallpaper) {
        // Make the request idempotent
        res.json({});
        return;
      }
      if (!canDeleteWallpaper(user, wallpaper)) {
        res.status(403).json({
          error: 'No permitted to delete this wallpaper',
        });
        return;
      }
      await deleteWallpaper(wallpaper);
      res.json({});
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.issues[0].message });
        return;
      }
      console.error(err);
      res.status(500).json({ error: `${err}` });
    }
  });
