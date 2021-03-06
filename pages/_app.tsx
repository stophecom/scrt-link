import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { appTitle } from '@/constants';
import { DefaultSeoProps, DefaultSeo } from 'next-seo';
import { useRouter } from 'next/dist/client/router';
import BaseThemeProvider from '@/components/BaseThemeProvider';
import Head from 'next/head';

const getDefaultSeoConfig = (pathname: string): DefaultSeoProps => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const url = `${baseUrl}${pathname}`;
  const title = appTitle;
  const description = `Share a secret! ${appTitle} is a URL shortener. Use it to send one-time disposable messages that are distroyed after the first visit.`;
  return {
    title,
    canonical: url,
    description,
    openGraph: {
      url,
      title,
      type: 'website',
      description,
      site_name: appTitle,
      images: [
        {
          url: `${baseUrl}/android-chrome-512x512.png`,
          height: 512,
          width: 512,
          alt: 'scrt.link large logo',
        },
        {
          url: `${baseUrl}/android-chrome-192x192.png`,
          height: 192,
          width: 192,
          alt: 'scrt.link small logo',
        },
      ],
    },
    additionalMetaTags: [
      { name: 'application-name', content: title },
      { property: 'dc:creator', content: 'Christophe Schwyzer' },
    ],
  };
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <DefaultSeo {...getDefaultSeoConfig(router.pathname)} />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#1b242e" />
        <meta name="theme-color" content="#ffffff"></meta>
        <meta
          name="keywords"
          content="scrt.link, secret text, one-time text, one-time link, disposable message, disposable link, url shortener"
          key="keywords"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,600;1,400&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <BaseThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BaseThemeProvider>
    </>
  );
};

export default MyApp;
