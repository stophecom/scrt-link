import React from 'react'
import { Box, Typography } from '@material-ui/core'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { FAQPage, WithContext } from 'schema-dts'

import Markdown from '@/components/Markdown'
import Page from '@/components/Page'
import { faq } from '@/data/faq'

import remark from 'remark'
import strip from 'strip-markdown'

type FaqProps = {
  jsonLd: WithContext<FAQPage>
  faq: {
    heading: string
    body: string
  }[]
}
const Faq = ({ faq, jsonLd }: FaqProps) => {
  return (
    <Page title="FAQ" subtitle="Frequently Asked Questions">
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
}

export const getStaticProps: GetStaticProps = async () => {
  const stripFaq = (isBodyStripped?: boolean) =>
    faq.map(({ heading, body }) => {
      let question = heading
      let answer = body

      if (isBodyStripped) {
        remark()
          .use(strip)
          .process(body, function (err, file) {
            if (err) throw err
            answer = String(file)
          })
      }

      remark()
        .use(strip)
        .process(heading, function (err, file) {
          if (err) throw err
          question = String(file)
        })

      return { heading: question, body: answer }
    })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: stripFaq(true).map(({ heading, body }) => {
      return {
        '@type': 'Question',
        name: heading,
        acceptedAnswer: {
          '@type': 'Answer',
          text: body,
        },
      }
    }),
  }
  return {
    props: { faq: stripFaq(), jsonLd },
  }
}
export default Faq
