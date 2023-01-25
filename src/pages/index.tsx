import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { options } from './api/auth/[...nextauth]';
import type { MemoType } from '../types/MemoType';
import Layout from '../components/Layout';
import Memo from '../components/Memo';
import { prisma } from '../lib/prisma';
import { Session } from 'next-auth';
import SignIn from 'components/SignIn';

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, options);
  if (!session) {
    return {
      props: {
        session: null,
        memos: null,
      },
    };
  }

  const memos = await prisma.memo.findMany({
    where: {
      authorId: session.user_id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return {
    props: {
      session: session,
      memos,
    },
  };
};

type Props = {
  session: Session | null;
  memos: MemoType[];
};

const Home = (props: Props) => {
  if (!props.session) {
    return (
      <div className="px-2">
        <Head>
          <title>Memo App</title>
          <meta name="description" content="this is memo app." />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-16">
          <h1 className="m-0 text-center text-7xl">Welcome to Memo App!</h1>

          <SignIn />
        </main>
      </div>
    );
  }

  return (
    <Layout>
      <div className="grid grid-flow-row gap-4 md:grid-cols-1 lg:grid-cols-3">
        {props && props.memos.map((memo) => <Memo key={memo.id} memo={memo} />)}
      </div>
    </Layout>
  );
};

export default Home;
