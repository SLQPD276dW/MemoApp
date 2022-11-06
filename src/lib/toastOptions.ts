import { Theme, ToastOptions } from 'react-toastify';

export const toastOptions = (theme: string): ToastOptions => {
  return {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme as Theme,
  };
};
