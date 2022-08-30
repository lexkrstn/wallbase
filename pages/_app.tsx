import { RESTRICTED_ROUTES } from '@/lib/constants';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '../lib/hooks/use-user';
import './globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user, loading: userLoading } = useUser({
    redirectTo: RESTRICTED_ROUTES.includes(router.pathname) ? '/' : undefined,
  });
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
