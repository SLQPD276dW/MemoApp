import React, { useRef } from 'react';
import Router, { useRouter } from 'next/router';
import type { MemoType } from 'types/MemoType';

async function deleteMemo(id: string): Promise<void> {
  await fetch(`/api/memo/delete/${id}`, {
    method: 'DELETE',
  });
  await Router.push('/');
}

const Memo = ({ memo }: { memo: MemoType }) => {
  const router = useRouter();

  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="card mt-4 w-auto bg-base-100 shadow-xl">
      <div className="navbar bg-base-100">
        <div className="flex-1" />
        <div className="flex-none gap-2">
          <div className="dropdown-end dropdown">
            <button className="btn-ghost btn-square btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
              <li>
                <button
                  className="btn-error btn text-white"
                  ref={deleteButtonRef}
                  onClick={async () => {
                    deleteButtonRef.current!.disabled = true;
                    deleteButtonRef.current!.classList.add('loading');
                    await deleteMemo(memo.id);
                  }}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="card-body"
        onClick={() => router.push('/memo/[memo_id]', `/memo/${memo.id}`)}
      >
        <h2 className="card-title">{memo.title}</h2>
        <p>
          {memo.content.length > 25
            ? memo.content.slice(0, 25) + '...'
            : memo.content}
        </p>
        <p>updated: {memo.updatedAt.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Memo;
