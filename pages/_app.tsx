import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../components/selectboxes/selectbox.scss';
import './globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Wallbase</title>
        <meta name="description" content="Searching for a desktop/mobile wallpapers? We got 'em." />
        <meta name="keywords" content="desktop wallpapers, HD wallpapers, widescreen, wallpaper, backgrounds"/>
        <link rel="icon" href="/favicon.gif" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
