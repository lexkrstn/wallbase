import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useUser } from '../lib/hooks/use-user';
import './globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const { user, loading: userLoading } = useUser({ redirectTo: '/' });
  return (
    <>
      <Head>
        <title>Wallbase</title>
        <meta name="description" content="Searching for a desktop/mobile wallpapers? We got 'em." />
        <meta name="keywords" content="desktop wallpapers, HD wallpapers, widescreen, wallpaper, backgrounds"/>
        <link rel="icon" href="/favicon.gif" />
      </Head>
      <Component {...pageProps} user={user} userLoading={userLoading} />
    </>
  );
}

export default MyApp;
