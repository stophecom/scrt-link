import React, { Fragment, ReactNode } from 'react'
import Head from 'next/head'
import { is } from 'ramda'
import { appTitle } from '@/constants'

export interface JsonLd extends Record<string, unknown> {
  '@type': string
}

export interface SeoProps {
  title: string
  description?: string
  keywords?: string
  jsonLd?: JsonLd
  noindex?: boolean
  children?: ReactNode
}

const generateJsonLD = (jsonLd: JsonLd) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    ...(is(Array)(jsonLd) ? { '@graph': [jsonLd] } : jsonLd),
  })

const SEO: React.FunctionComponent<SeoProps> = ({
  description,
  jsonLd,
  title,
  noindex,
  children,
  keywords,
}) => {
  const composedTitle = `${title ? `${title} | ` : ''}🤫 ${appTitle}`
  return (
    <Head>
      <title>{composedTitle}</title>
      <meta property="og:title" content={composedTitle} key="og:title" />
      {description && (
        <Fragment>
          <meta name="description" content={description} key="description" />
          <meta property="og:description" content={description} key="og:description" />
        </Fragment>
      )}
      {keywords && <meta property="keywords" content={keywords} key="keywords" />}

      {noindex && (
        <Fragment>
          <meta name="robots" content="noindex" key="robots" />
          <meta name="googlebot" content="noindex" key="googlebot" />
        </Fragment>
      )}
      {children}
      {jsonLd && (
        <script
          dangerouslySetInnerHTML={{ __html: generateJsonLD(jsonLd) }}
          type="application/ld+json"
        />
      )}
    </Head>
  )
}

export default SEO
