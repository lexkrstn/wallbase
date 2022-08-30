import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import z from 'zod';
import { jwtStrategy } from '@/lib/server/passport';
import User from '@/entities/user';
import { createReport, findReports } from '@/lib/server/reports';
import { Report, REPORT_TYPES } from '@/entities/report';

const schemaGet = z.object({
  wallpaperId: z.string(),
  perPage: z.number().min(1).optional(),
  page: z.number().min(1).optional(),
});

const schemaPost = z.object({
  wallpaperId: z.string(),
  userId: z.string(),
  type: z.enum(REPORT_TYPES),
  duplicateId: z.string().optional(),
  message: z.string(),
});

type GetData = { error?: string } | Report[];
type PostData = { error?: string } | Report;

export default nextConnect()
  .get(async (req: NextApiRequest, res: NextApiResponse<GetData>) => {
    try {
      const { reports, totalCount } = await findReports(schemaGet.parse(req.query));
      res.setHeader('X-Total-Count', totalCount);
      res.json(reports);
    } catch (err) {
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
      const report = await createReport(schemaPost.parse(req.query));
      res.json(report);
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : `${err}`,
      });
    }
  });
