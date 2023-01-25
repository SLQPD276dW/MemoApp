import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTheme } from 'next-themes';
import { toastOptions } from 'lib/toastOptions';
import Modal from 'react-modal';
import DeleteModal from './DeleteModal';
import { customStyles } from 'lib/customModalStyle';

const Header = () => {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const createButtonRef = useRef<HTMLButtonElement>(null);

  async function createMemo(button: HTMLButtonElement) {
    button.disabled = true;
    button.classList.add('loading');

    try {
      const postsCount = await fetch(`../../api/user/getPostsCountByUser`, {
        method: 'GET',
      }).then((res) => {
        return res.json();
      });
      if (Number(postsCount.count) >= process.env.NEXT_PUBLIC_MEMO_COUNT_MAX) {
        console.error('return');
        toast.error(
          'Memo Filled',
          toastOptions(window.localStorage.getItem('theme')!)
        );
        throw new Error(`Memo Filled`);
      }

      const result_json = await fetch(`../../api/memo/create`, {
        method: 'POST',
      }).then((res) => {
        return res.json();
      });

      await Router.push(
        {
          pathname: '/memo/[memo_id]',
          query: { memo_id: result_json.memo_id },
        },
        undefined,
        { shallow: false }
      );

      toast.success('Created!!', toastOptions(theme!));
    } catch (error) {
      console.error(error);
    }
    button.disabled = false;
    button.classList.remove('loading');
  }

  let right = <div>Error!</div>;

  if (status === 'loading') {
    right = (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    right = (
      <>
        <button className="btn" onClick={() => signIn()}>
          Login
        </button>
      </>
    );
  }

  if (session) {
    right = (
      <>
        <button
          className="btn-outline btn-success btn mr-4"
          ref={createButtonRef}
          onClick={() => createMemo(createButtonRef.current!)}
        >
          Create
        </button>
        <div className="dropdown-end dropdown">
          <label
            tabIndex={0}
            className="border-bg-base-content btn-ghost btn gap-2 border-2"
          >
            {session.user?.name}
            <Image
              src={session.user?.image!}
              width={30}
              height={30}
              alt="user_image"
              className="w-10 rounded-full border-2 border-red-500"
            />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 border-2 border-slate-700 bg-base-100 p-2 shadow"
          >
            <li>
              <label className="swap">
                <input
                  type="checkbox"
                  defaultChecked={theme === 'light' ? true : false}
                  onClick={() => {
                    setTheme(theme === 'light' ? 'dark' : 'light');
                  }}
                />
                <div className="swap-on">Light</div>
                <div className="swap-off">Dark</div>
              </label>
            </li>
            <li>
              <button
                onClick={() =>
                  signOut({
                    callbackUrl: process.env.NEXT_PUBLIC_BASE_URL,
                  })
                }
              >
                Sign Out
              </button>
            </li>
            <li>
              <div>
                <button
                  className="btn-outline btn-error btn"
                  onClick={openModal}
                >
                  Delete Account
                </button>
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Delete Account"
                  style={customStyles}
                >
                  <DeleteModal closeModal={closeModal} />
                </Modal>
              </div>
            </li>
          </ul>
        </div>
      </>
    );
  }

  return (
    <div className="navbar bg-base-100 shadow-xl">
      <div className="flex-1">
        <Link href="/" className="btn-ghost btn text-xl normal-case">
          Memo App
        </Link>
      </div>
      <div className="flex-none">{right}</div>
    </div>
  );
};

export default Header;
