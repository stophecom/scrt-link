import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { appWithTranslation } from 'next-i18next'

import nextI18NextConfig from 'next-i18next.config.js'
import { DefaultSeoProps, DefaultSeo } from 'next-seo'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import PlausibleProvider from 'next-plausible'
import { Provider } from 'next-auth/client'

import { CustomPage } from '@/types'
import DefaultLayout from '@/layouts/Default'
import { appTitle, twitterHandle } from '@/constants'
import BaseThemeProvider from '@/components/BaseThemeProvider'
import theme from '@/theme'

const getDefaultSeoConfig = (pathname: string): DefaultSeoProps => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const url = `${baseUrl}${pathname}`
  const title = appTitle
  const description = `With ${appTitle} you can securely share sensitive information online: End-to-end encryption combined with a one time self-destructive link.`
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

type Props = AppProps & {
  Component: CustomPage
}

const MyApp = ({ Component, pageProps }: Props) => {
  const router = useRouter()

  const Layout = Component.layout ?? DefaultLayout

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <Provider session={pageProps.session}>
      <PlausibleProvider domain="scrt.link" exclude="/l/*">
        <SWRConfig value={{ fetcher: (url) => fetch(url).then((res) => res.json()) }}>
          <DefaultSeo {...getDefaultSeoConfig(router.pathname)} />
          <Head>
            <meta name="twitter:card" content="summary" key="twitter:card" />
            <meta name="twitter:creator" content={twitterHandle} key="twitter:creator" />

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="msapplication-TileColor" content={theme.palette.primary.main} />
            <meta
              name="keywords"
              content="scrt.link, secret link, secret message link, one time secret, one time password, one time message, one time link, disposable message, disposable link, url shortener, self-destructive links, share sensitive information"
              key="keywords"
            />
            <meta name="theme-color" content={theme.palette.primary.main} />
          </Head>

          <BaseThemeProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </BaseThemeProvider>
        </SWRConfig>
      </PlausibleProvider>
    </Provider>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig)
