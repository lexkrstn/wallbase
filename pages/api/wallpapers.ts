import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import CONFIG from '../../lib/config';
import Wallpaper from '../../interfaces/wallpaper';
import { getImageSize } from '../../lib/image';
import { uploadWallpaper } from '../../lib/wallpapers';
import { getArrayParam, getNumericParam, getStringParam } from '../../lib/helpers/query';
import { BOARD_G, PURITY_SFW } from '../../interfaces/constants';
import { jwtStrategy } from '../../lib/passport';
import { addWallpaperTags } from '../../lib/tags';
import { UploadedFile, uploadMultipartForm } from '../../lib/upload';

type Data = { error?: string } | Wallpaper;

export default nextConnect()
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .post(async (req: NextApiRequest, res: NextApiResponse<Data>) => {
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
        purity: getNumericParam(req, 'purity') ?? PURITY_SFW,
        board: getNumericParam(req, 'board') ?? BOARD_G,
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
