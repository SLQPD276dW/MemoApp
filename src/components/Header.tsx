import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { toastOptions } from "lib/toastOptions";
import Modal from "react-modal";

const customStyles: Modal.Styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
    },

    content: {
        backgroundColor: "hsl(var(--b1))",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        width: "500px",
        height: "270px",
        transform: "translate(-50%, -50%)",
        color: "base-content",
    },
};

const Header = () => {
    const { data: session, status } = useSession();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const createButtonRef = useRef<HTMLButtonElement>(null);

    async function createMemo(button: HTMLButtonElement) {
        button.disabled = true;
        button.classList.add("loading");

        try {
            const postsCount = await fetch(
                `../../api/user/getPostsCountByUser`,
                {
                    method: "GET",
                }
            ).then((res) => {
                return res.json();
            });
            if (
                Number(postsCount.count) >=
                process.env.NEXT_PUBLIC_MEMO_COUNT_MAX
            ) {
                console.error("return");
                toast.error(
                    "Memo Filled",
                    toastOptions(window.localStorage.getItem("theme")!)
                );
                throw new Error(`Memo Filled`);
            }

            const result_json = await fetch(`../../api/memo/create`, {
                method: "POST",
            }).then((res) => {
                return res.json();
            });

            await Router.push(
                {
                    pathname: "/memo/[memo_id]",
                    query: { memo_id: result_json.memo_id },
                },
                undefined,
                { shallow: false }
            );

            toast.success("Created!!", toastOptions(theme!));
        } catch (error) {
            console.error(error);
        }
        button.disabled = false;
        button.classList.remove("loading");
    }

    let right = <div>Error!</div>;

    if (status === "loading") {
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
                    className="btn btn-outline btn-success mr-4"
                    ref={createButtonRef}
                    onClick={() => createMemo(createButtonRef.current!)}
                >
                    Create
                </button>
                <div className="dropdown dropdown-end">
                    <label
                        tabIndex={0}
                        className="btn btn-ghost border-2 border-slate-700 gap-2"
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
                        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 border-2 border-slate-700"
                    >
                        <li>
                            <label className="swap">
                                <input
                                    type="checkbox"
                                    defaultChecked={
                                        theme === "light" ? true : false
                                    }
                                    onClick={() => {
                                        setTheme(
                                            theme === "light" ? "dark" : "light"
                                        );
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
                                        callbackUrl: "http://localhost:3000",
                                    })
                                }
                            >
                                Sign Out
                            </button>
                        </li>
                        <li>
                            <div>
                                <button
                                    className="btn btn-outline btn-error"
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
                                    <h3 className="font-bold text-lg">
                                        本当にアカウントを消去しますか？
                                    </h3>
                                    <p className="py-4">このアカウントとそれに紐づく全てのメモが消去されます。この操作は取り消せません。</p>
                                    <div className="flex justify-center mt-16 gap-8">
                                        <button
                                            className="btn"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-error btn-outline"
                                            onClick={async () => {
                                                try {
                                                    await fetch(
                                                        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/delete`,
                                                        {
                                                            method: "DELETE",
                                                        }
                                                    );
                                                    router.push(
                                                        "/",
                                                        undefined,
                                                        { shallow: false }
                                                    );
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                            }}
                                        >
                                            Delete Account
                                        </button>
                                    </div>
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
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    Memo App
                </Link>
            </div>
            <div className="flex-none">{right}</div>
        </div>
    );
};

export default Header;
