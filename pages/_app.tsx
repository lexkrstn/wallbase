import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionContext, useSessionProvider } from '@/lib/hooks/use-session-provider';
import './globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const session = useSessionProvider();
  return (
    <>
      <Head>
        <title>Wallbase</title>
        <meta name="description" content="Searching for a desktop/mobile wallpapers? We got 'em." />
        <meta name="keywords" content="desktop wallpapers, HD wallpapers, widescreen, wallpaper, backgrounds"/>
        <link rel="icon" href="/favicon.gif" />
      </Head>
      <SessionContext.Provider value={session}>
        <Component {...pageProps} />
      </SessionContext.Provider>
    </>
  );
}

export default MyApp;
