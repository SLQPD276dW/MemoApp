import React, { useState, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import type { MemoType } from 'types/MemoType';
import { unstable_getServerSession } from 'next-auth';
import { options } from 'pages/api/auth/[...nextauth]';
import { prisma } from 'lib/prisma';
import Layout from 'components/Layout';
import { useHotkeys } from 'react-hotkeys-hook';
import MemoEditor from 'components/MemoEditor';
import Preview from 'components/Preview';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';
import { toastOptions } from 'lib/toastOptions';

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, options);

  if (session) {
    const memo = await prisma.memo.findFirst({
      where: {
        AND: [
          {
            id: String(params?.memo_id),
          },
          {
            authorId: session?.user_id,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });
    if (memo) {
      return {
        props: {
          memo,
        },
      };
    } else {
      return {
        props: {
          memo,
        },
      };
    }
  } else {
    return {
      props: {
        redirect: {
          destination: '/',
          permanent: false,
        },
      },
    };
  }
};

type Props = {
  memo: MemoType;
};

const MemoEditorPage = (props: Props) => {
  const { data: session, status } = useSession();

  const { theme } = useTheme();
  const [content, setContent] = useState(props.memo.content);
  const [title, setTitle] = useState(props.memo.title);

  const updateButtonRef = useRef<HTMLButtonElement>(null);

  type EditorStatusType = 'Markdown' | 'Preview';
  const [activeEditorStatus, SetEditorStatus] =
    useState<EditorStatusType>('Markdown');

  function toggleStatus() {
    if (activeEditorStatus === 'Markdown') {
      SetEditorStatus('Preview');
    } else if (activeEditorStatus === 'Preview') {
      SetEditorStatus('Markdown');
    }
  }

  const isEqualEditorStatus = (status: EditorStatusType) =>
    activeEditorStatus === status;

  async function updateMemo(button: HTMLButtonElement) {
    button.disabled = true;
    button.classList.add('loading');

    const isTitleExceed =
      title.length > process.env.NEXT_PUBLIC_MEMO_TITLE_LENGTH_MAX;
    const isContentExceed =
      content.length > process.env.NEXT_PUBLIC_MEMO_CONTENT_LENGTH_MAX;

    if (!isTitleExceed && !isContentExceed) {
      try {
        const contentPreview = ((content: string) => {
          if (content.length > 25) {
            return content.slice(25) + '...';
          } else {
            return content;
          }
        })(content);
        const body = {
          title,
          content,
          content_preview: contentPreview,
        };
        const result = await fetch(`../api/memo/update/${props.memo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        toast.info('Updated!!', toastOptions(theme!));
      } catch (error) {
        console.error(error);
      }
    }

    if (isTitleExceed) {
      toast.error(
        'タイトルの文字数が規定を超過しています。',
        toastOptions(theme!)
      );
    }

    if (isContentExceed) {
      toast.error('メモの文字数が規定を超過しています。', toastOptions(theme!));
    }

    button.classList.remove('loading');
    button.disabled = false;
  }

  useHotkeys(
    'ctrl+s',
    (e) => {
      e.preventDefault();
      updateMemo(updateButtonRef.current!);
    },
    [title, content]
  );

  useHotkeys(
    'tab',
    (e) => {
      e.preventDefault();
      toggleStatus();
    },
    [activeEditorStatus]
  );

  if (status === 'loading') {
    <div>
      <article>Loading...</article>
    </div>;
  }

  if (status === 'unauthenticated' || !session) {
    <div>Error...</div>;
  }

  if (session) {
    return (
      <Layout>
        <div className="phone-3 artboard-horizontal mx-auto my-6 lg:artboard">
          <div className="flex items-center justify-end gap-2">
            <kbd className="border-bg-base-content kbd-sm rounded-lg border-2 border-solid">
              ctrl
            </kbd>
            +
            <kbd className="border-bg-base-content kbd-sm rounded-lg border-2 border-solid">
              s
            </kbd>
            <button
              className="btn-outline btn-info btn"
              ref={updateButtonRef}
              onClick={() => updateMemo(updateButtonRef.current!)}
            >
              Update
            </button>
          </div>
          <div className="my-2 flex justify-center">
            <input
              type="text"
              defaultValue={props.memo.title}
              placeholder="Title"
              className="input-bordered input input-lg"
              onChange={(input) => setTitle(input.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">
                {title.length} / {process.env.NEXT_PUBLIC_MEMO_TITLE_LENGTH_MAX}
              </span>
            </label>
          </div>
          <div className="flex flex-col items-center">
            <kbd className="border-bg-base-content kbd-sm rounded-lg border-2 border-solid">
              tab
            </kbd>
            <div className="tabs font-bold">
              <a
                className={`font-bold' tab tab-lifted tab-lg ${
                  isEqualEditorStatus('Markdown') ? 'tab-active' : ''
                }`}
                onClick={() => SetEditorStatus('Markdown')}
              >
                Markdown
              </a>
              <a
                className={`font-bold' tab tab-lifted tab-lg ${
                  isEqualEditorStatus('Preview') ? 'tab-active' : ''
                }`}
                onClick={() => SetEditorStatus('Preview')}
              >
                Preview
              </a>
            </div>
          </div>
          <label className="label flex justify-end">
            <span className="label-text-alt">
              {content.length} /{' '}
              {process.env.NEXT_PUBLIC_MEMO_CONTENT_LENGTH_MAX}
            </span>
          </label>
          <MemoEditor
            content={content}
            editorType={activeEditorStatus}
            onCodeChange={setContent}
            isHidden={!isEqualEditorStatus('Markdown')}
          />
          <Preview
            content={content}
            isHidden={!isEqualEditorStatus('Preview')}
          />
        </div>
      </Layout>
    );
  }
};

export default MemoEditorPage;
