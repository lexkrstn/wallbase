import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import Wallpaper, { canDeleteWallpaper } from '@/entities/wallpaper';
import { deleteWallpaper, findWallpaperById } from '@/lib/server/wallpapers';
import { jwtStrategy } from '@/lib/server/passport';
import User from '@/entities/user';

type GetData = { error?: string } | Wallpaper;
type DeleteData = { error?: string } | {};

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    const wallpaper = await findWallpaperById(req.query.id as string);
    if (!wallpaper) {
      res.status(404).json({ error: 'No such wallpaper' });
      return;
    }
    res.json(wallpaper);
  })
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .delete(async (req: NextApiRequest, res: NextApiResponse<DeleteData>) => {
    const user = (req as any).user as User;
    const wallpaper = await findWallpaperById(req.query.id as string);
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
  });
