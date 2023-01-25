import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider defaultTheme="light">
        <ToastContainer />
        <Component key={router.asPath} {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
