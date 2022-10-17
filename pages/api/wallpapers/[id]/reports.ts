import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import z, { ZodError } from 'zod';
import { omit } from 'lodash';
import { ForeignKeyViolationError, UniqueViolationError } from 'db-errors';
import { jwtStrategy } from '@/lib/server/passport';
import User from '@/entities/user';
import { canUserCreateReport, createReport, findReports } from '@/lib/server/reports';
import { Report, REPORT_TYPES } from '@/entities/report';

const schemaGet = z.object({
  id: z.string().uuid(),
  pageSize: z.number().optional(),
  page: z.number().optional(),
});

const schemaPost = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  type: z.enum(REPORT_TYPES),
  duplicateId: z.string().uuid('Duplicate ID is not valid').optional(),
  message: z.string(),
});

type GetData = { error?: string } | Report[];
type PostData = { error?: string } | Report;

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const dto = schemaGet.parse(req.query);
      const { reports } = await findReports({
        ...omit(dto, ['id']),
        wallpaperId: dto.id,
      });
      res.json(reports);
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: err.issues[0].message,
        });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : `${err}`,
      });
    }
  })
  .use(passport.initialize())
  .use(passport.authenticate(jwtStrategy, { session: false }))
  .post(async (req: NextApiRequest, res: NextApiResponse<PostData>) => {
    const user = (req as any).user as User;
    try {
      if (!canUserCreateReport(user)) {
        res.status(403).json({
          error: 'You are banned and cannot send reports anymore',
        });
        return;
      }
      const dto = schemaPost.parse({
        ...req.query,
        ...req.body,
      })
      const report = await createReport({
        ...omit(dto, ['id']),
        wallpaperId: dto.id,
      });
      res.json(report);
    } catch (err) {
      if (err instanceof UniqueViolationError) {
        res.status(409).json({
          error: 'Someone has already reported on this wallpaper',
        });
        return;
      }
      if (err instanceof ZodError) {
        res.status(400).json({
          error: err.issues[0].message,
        });
        return;
      }
      if (err instanceof ForeignKeyViolationError) {
        res.status(400).json({
          error: 'The is no wallpaper with this ID (yet?)',
        });
        return;
      }
      res.status(500).json({
        error: err instanceof Error ? err.message : `${err}`,
      });
    }
  });
