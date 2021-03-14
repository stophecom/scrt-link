import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import Layout from '@/components/Layout'
import { appTitle, twitterHandle } from '@/constants'
import { DefaultSeoProps, DefaultSeo } from 'next-seo'
import { useRouter } from 'next/dist/client/router'
import BaseThemeProvider from '@/components/BaseThemeProvider'
import Head from 'next/head'
import PlausibleProvider from 'next-plausible'

import theme from '@/theme'

const getDefaultSeoConfig = (pathname: string): DefaultSeoProps => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const url = `${baseUrl}${pathname}`
  const title = appTitle
  const description = `Share a secret! Use ${appTitle} to send one-time disposable messages via link that self-distructs after the first visit. `
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
          url: `${baseUrl}/og-image.png`,
          height: 1200,
          width: 627,
          alt: 'scrt.link - Share a secret!',
        },
        {
          url: `${baseUrl}/android-chrome-512x512.png`,
          height: 512,
          width: 512,
          alt: 'scrt.link - Share a secret!',
        },
        {
          url: `${baseUrl}/android-chrome-192x192.png`,
          height: 192,
          width: 192,
          alt: 'scrt.link - Share a secret!',
        },
      ],
    },
    additionalMetaTags: [
      { name: 'application-name', content: title },
      { property: 'dc:creator', content: 'Christophe Schwyzer' },
    ],
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <PlausibleProvider domain="scrt.link" customDomain="https://stats.scrt.link" exclude="/l/*">
      <DefaultSeo {...getDefaultSeoConfig(router.pathname)} />
      <Head>
        <meta name="twitter:card" content="summary" key="twitter:card" />
        <meta name="twitter:creator" content={twitterHandle} key="twitter:creator" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="manifest.json" />
        <meta name="msapplication-TileColor" content={theme.palette.primary.main} />
        <meta
          name="keywords"
          content="scrt.link, secret text, one-time text, one-time link, disposable message, disposable link, url shortener, self-distructing links, share sensitive information"
          key="keywords"
        />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <BaseThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BaseThemeProvider>
    </PlausibleProvider>
  )
}

export default MyApp
