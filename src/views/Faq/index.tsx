import React from 'react'
import { Box, Typography } from '@material-ui/core'
import Head from 'next/head'

import Markdown from '@/components/Markdown'
import Page from '@/components/Page'
import { faq } from '@/data/faq'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(({ heading, body }, index) => ({
    '@type': 'Question',
    name: heading,
    acceptedAnswer: {
      '@type': 'Answer',
      text: <Markdown source={body} />,
    },
  })),
}

const Faq = () => (
  <Page title="Frequently Asked Questions">
    <Head>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
    </Head>
    {faq.map(({ heading, body }, index) => (
      <Box key={index} py={3}>
        <Typography variant="h3">{heading}</Typography>
        <Markdown source={body} />
      </Box>
    ))}
  </Page>
)

export default Faq
