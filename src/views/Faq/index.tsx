import React from 'react'
import { Box, Typography, Divider } from '@material-ui/core'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { FAQPage, WithContext } from 'schema-dts'
import remark from 'remark'
import strip from 'strip-markdown'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { Link } from '@/components/Link'
import { scrollIntoView } from '@/utils/browser'
import Markdown from '@/components/Markdown'
import Page from '@/components/Page'
import { faq, faqCategories } from '@/data/faq'
import { emailSupport } from '@/constants'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    unorderedList: {
      paddingLeft: '2em',
      '& a': { paddingTop: '.2em', paddingBottom: '.2em', display: 'inline-flex' },
    },
  }),
)

type FaqProps = {
  jsonLd: WithContext<FAQPage>
  faqByCategory: {
    title: string
    contents: {
      id: string
      heading: string
      body: string
    }[]
  }[]
}
const Faq = ({ faqByCategory, jsonLd }: FaqProps) => {
  const classes = useStyles()
  return (
    <Page title="FAQ" subtitle="Frequently Asked Questions">
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      </Head>
      <Box mb={5}>
        {faqByCategory.map(({ title, contents }, index) => (
          <Box key={index} mb={4}>
            <Typography variant="h5">{title}</Typography>
            <ul className={classes.unorderedList}>
              {contents.map(({ id, heading }, index) => (
                <li key={index}>
                  <Typography component={Link} href={`#${id}`} onClick={scrollIntoView}>
                    {heading}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
      <Box mb={5}>
        <Divider />
      </Box>
      {faqByCategory.map(({ title, contents }, index) => (
        <Box key={index} mb={4}>
          <Typography variant="h3">{title}</Typography>

          {contents.map(({ id, heading, body }, index) => (
            <Box key={index} py={3}>
              <Typography id={id} variant="h4">
                {heading}
              </Typography>
              <Markdown source={body} />
            </Box>
          ))}
          <Box pt={5}>
            <Divider />
          </Box>
        </Box>
      ))}
      <Box mb={5}>
        <Typography>
          {`Didn't find the answer you were looking for? Contact support: `}
          <Link href={`mailto:${emailSupport}`}>{emailSupport}</Link>
        </Typography>
      </Box>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const stripFaq = (isBodyStripped?: boolean) =>
    faq.map(({ heading, body, ...props }) => {
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

      return { heading: question, body: answer, ...props }
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

  const faqByCategory = faqCategories.map(({ id, ...props }) => {
    const faqList = stripFaq().filter(({ category }) => category === id)

    return {
      ...props,
      contents: faqList,
    }
  })
  return {
    props: { faqByCategory, jsonLd },
  }
}
export default Faq
