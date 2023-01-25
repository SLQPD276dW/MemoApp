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

  if (req.method === 'DELETE') {
    if (session) {
      const delete_memo = await prisma.memo.delete({
        where: {
          id: String(memo_id),
        },
      });

      res.json(delete_memo);
    } else {
      res.status(500);
    }
  }
}
