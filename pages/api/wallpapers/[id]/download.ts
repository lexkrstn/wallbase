import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z, { ZodError } from 'zod';
import Wallpaper from '@/entities/wallpaper';
import { findWallpaperById, getWallpaperPath } from '@/lib/server/wallpapers';
import { createThumbnailStream } from '@/lib/server/image';

type GetData = { error?: string } | Wallpaper;

const schema = z.object({
  id: z.string().uuid(),
  width: z.string().regex(/\d+/).transform(Number).refine(v => v > 0),
  height: z.string().regex(/\d+/).transform(Number).refine(v => v > 0),
});

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const dto = schema.parse(req.query);
      const wallpaper = await findWallpaperById(dto.id);
      if (!wallpaper) {
        res.status(404).json({ error: 'No such wallpaper' });
        return;
      }
      if (dto.width > wallpaper.width || dto.height > wallpaper.height) {
        res.status(400).json({ error: 'No such wallpaper' });
        return;
      }
      res.setHeader('Content-Type', wallpaper.mimetype);
      await createThumbnailStream(
        getWallpaperPath(wallpaper.id, wallpaper.mimetype),
        wallpaper.width,
        wallpaper.height,
        res,
        dto.width,
        dto.height,
      );
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: err.issues[0].message });
        return;
      }
      console.error(err);
      res.status(500).json({ error: `${err}` });
    }
  })
