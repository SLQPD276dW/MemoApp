import { getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { options } from '../../auth/[...nextauth]';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);

  if (req.method === 'DELETE') {
    if (session) {
      await prisma.memo.deleteMany({
        where: {
          authorId: session.user_id,
        },
      });
      const delete_user = await prisma.user.delete({
        where: {
          id: session.user_id,
        },
      });

      res.json(delete_user);
    } else {
      res.status(500);
    }
  }
}
