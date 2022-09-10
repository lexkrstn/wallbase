import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import z, { ZodError } from 'zod';
import { omit } from 'lodash';
import Wallpaper from '@/entities/wallpaper';
import { findSimilarWallpapers, findWallpaperById } from '@/lib/server/wallpapers';

const schemaGet = z.object({
  id: z.string().uuid(),
  pageSize: z.number().optional(),
  page: z.number().optional(),
});

type GetData = { error?: string } | Wallpaper[];

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const dto = schemaGet.parse(req.query);
      const wallpaper = await findWallpaperById(dto.id);
      if (!wallpaper) {
        res.status(404).json({ error: 'No such wallpaper' });
        return;
      }
      const wallpapers = await findSimilarWallpapers(wallpaper, omit(dto, ['id']));
      res.json(wallpapers);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: err.issues[0].message,
        });
        return;
      }
      console.error(err);
      res.status(500).json({
        error: err instanceof Error ? err.message : `${err}`,
      });
    }
  });
