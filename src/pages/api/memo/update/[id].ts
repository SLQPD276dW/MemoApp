import { unstable_getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { options } from '../../auth/[...nextauth]';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, options);
  const memo_id = req.query.id;
  const { title, content } = req.body;
  if (req.method === 'PUT') {
    if (session) {
      const update_memo = await prisma.memo.update({
        where: {
          id: String(memo_id),
        },
        data: {
          title: title,
          content: content,
          contentPreview: req.body.content_preview,
          updatedAt: new Date(),
        },
      });

      res.json(update_memo);
    } else {
      res.status(500);
    }
  }
}
