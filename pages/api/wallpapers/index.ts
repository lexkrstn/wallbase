import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import CONFIG from '@/lib/server/config';
import Wallpaper from '@/entities/wallpaper';
import { getImageSize } from '@/lib/server/image';
import { findWallpapers, uploadWallpaper } from '@/lib/server/wallpapers';
import {
  getArrayParam,
  getEnumParam,
  getNumericParam,
  getStringParam,
} from '@/lib/helpers/query';
import { Board, Purity } from '@/lib/constants';
import { jwtStrategy } from '@/lib/server/passport';
import { addWallpaperTags } from '@/lib/server/wallpapers';
import { UploadedFile, uploadMultipartForm } from '@/lib/server/upload';
import {
  ASPECTS,
  RESOLUTIONS,
  RESOLUTION_OPERATORS,
  ORDERS,
  ORDER_BY_FIELDS,
  PAGE_SIZES,
  PageSizeType,
} from '@/lib/types';

type PostData = { error?: string } | Wallpaper;
type GetData = { error?: string } | Wallpaper[];

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const { wallpapers, totalCount } = await findWallpapers({
        purity: getNumericParam(req, 'purity'),
        boards: getNumericParam(req, 'boards'),
        query: getStringParam(req, 'query'),
        aspect: getEnumParam(req, 'aspect', ASPECTS),
        resolution: getEnumParam(req, 'resolution', RESOLUTIONS),
        resolutionOp: getEnumParam(req, 'resolutionOp', RESOLUTION_OPERATORS),
        order: getEnumParam(req, 'order', ORDERS),
        orderBy: getEnumParam(req, 'orderBy', ORDER_BY_FIELDS),
        page: getNumericParam(req, 'page', 'both', { min: 1 }),
        pageSize: parseInt(getEnumParam(req, 'pageSize', PAGE_SIZES) as string, 10) as PageSizeType,
      }, { withTags: true });
      res.setHeader('X-Total-Count', totalCount);
      res.json(wallpapers);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: `${(err as Error).message || err}`,
      });
    }
  })
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .post(async (req: NextApiRequest, res: NextApiResponse<PostData>) => {
    const userId = (req as any).user.id as string;
    let file: UploadedFile | null = null;
    try {
      const { files } = await uploadMultipartForm(req, {
        addFieldsToBody: true,
      });
      if (!files?.file.length) {
        throw new Error('File required');
      }
      file = files.file[0];

      if (!CONFIG.upload.allowedMimeTypes.includes(file.mimetype || '')) {
        throw new Error('Unknown file type');
      }
      const { width, height } = await getImageSize(file.path);
      const { minWidth, minHeight, maxWidth, maxHeight } = CONFIG.upload;
      if (width < minWidth || height < minHeight) {
        throw new Error(`Too small (min = ${minWidth}x${minHeight})`);
      }
      if (width > maxWidth || height > maxHeight) {
        throw new Error(`Too big (max = ${maxWidth}x${maxHeight})`);
      }

      const wallpaper = await uploadWallpaper({
        path: file.path,
        mimetype: file.mimetype!,
        fileSize: file.size,
        uploaderId: userId,
        purity: getNumericParam(req, 'purity') ?? Purity.SFW,
        board: getNumericParam(req, 'board') ?? Board.G,
        sourceUrl: getStringParam(req, 'sourceUrl'),
        authorName: getStringParam(req, 'authorName'),
        authorUrl: getStringParam(req, 'authorUrl'),
      });

      const tagIds = getArrayParam<string>(req, 'tags');
      if (tagIds && tagIds.length) {
        await addWallpaperTags(wallpaper.id, tagIds, userId);
      }

      res.json(wallpaper);
    } catch (error: any) {
      if (file) {
        fs.unlink(file.path).catch(() => {});
      }
      res.status(400).json({ error: error.message });
    }
  });

export const config = {
  // Disable default NextJS body parser in order the formidable's one work
  api: { bodyParser: false },
};
