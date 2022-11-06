import { unstable_getServerSession } from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { options } from '../auth/[...nextauth]';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, options);

  if (session) {
    const result = await prisma.memo.create({
      data: {
        title: '',
        content: '',
        contentPreview: '',
        published: false,
        author: { connect: { email: session.user?.email! } },
      },
    });
    res.json({ memo_id: result.id });
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
}
