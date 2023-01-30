import { getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { options } from '../auth/[...nextauth]';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, options);

  if (req.method === 'GET') {
    if (session) {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.user_id,
        },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      });
      res.json({ count: user?._count.posts });
    } else {
      res.status(500);
    }
  }
}
