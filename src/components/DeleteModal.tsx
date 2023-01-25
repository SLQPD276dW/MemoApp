import { useRouter } from 'next/router';

const DeleteModal = ({ closeModal }: { closeModal: () => void }) => {
  const router = useRouter();

  return (
    <>
      <h3 className="text-lg font-bold">本当にアカウントを消去しますか？</h3>
      <p className="py-4">
        このアカウントとそれに紐づく全てのメモが消去されます。この操作は取り消せません。
      </p>
      <div className="mt-16 flex justify-center gap-8">
        <button className="btn" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn-outline btn-error btn"
          onClick={async () => {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/delete`,
                {
                  method: 'DELETE',
                }
              );
              router.push('/', undefined, { shallow: false });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Delete Account
        </button>
      </div>
    </>
  );
};

export default DeleteModal;
