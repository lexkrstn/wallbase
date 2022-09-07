import { NextApiRequest, NextApiResponse } from 'next';
import Tag from '@/entities/tag';
import { getEnumParam, getNumericParam, getStringParam } from '@/lib/helpers/query';
import { findTags } from '@/lib/server/tags';

export default async function listTags(req: NextApiRequest, res: NextApiResponse<Tag[]>) {
  const { tags, totalCount } = await findTags({
    query: getStringParam(req, 'q'),
    purity: getNumericParam(req, 'purity'),
    page: getNumericParam(req, 'page'),
    perPage: getNumericParam(req, 'perPage'),
    categoryId: getStringParam(req, 'categoryId'),
    order: getEnumParam(req, 'order', ['asc', 'desc']),
    orderBy: getEnumParam(req, 'order', ['name', 'wallpaper_count', 'fav_count']),
  });

  res.setHeader('X-Total-Count', totalCount);
  res.json(tags);
}
