import React from 'react'
import { styled } from '@mui/system'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation, i18n } from 'next-i18next'

import { Box, Typography, Divider } from '@mui/material'
import Head from 'next/head'
import { FAQPage, WithContext } from 'schema-dts'
import remark from 'remark'
import strip from 'strip-markdown'

import { scrollIntoView } from '@/utils/browser'
import FaqAccordion from '@/components/Accordion'
import { Link } from '@/components/Link'

import Page from '@/components/Page'
import { faq, faqCategories } from '@/data/faq'
import { emailSupport } from '@/constants'

const PREFIX = 'Faq'

const classes = {
  unorderedList: `${PREFIX}-unorderedList`,
}

const StyledPage = styled(Page)(({ theme }) => ({
  [`& .${classes.unorderedList}`]: {
    paddingLeft: '2em',
    '& a': { paddingTop: '.2em', paddingBottom: '.2em', display: 'inline-flex' },
  },
}))

type FaqProps = {
  jsonLd: WithContext<FAQPage>
  faqByCategory: {
    title: string
    id: string
    contents: {
      id: string
      heading: string
      body: string
    }[]
  }[]
}
const Faq = ({ faqByCategory, jsonLd }: FaqProps) => {
  const { t } = useTranslation()

  return (
    <StyledPage title="FAQ" subtitle={t('common:views.FAQ.subtitle', 'Frequently Asked Questions')}>
      <Head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
      </Head>
      <Typography>
        <strong>{t('common:views.FAQ.introQuestion', 'What topic can we help you with?')}</strong>
      </Typography>
      <ul className={classes.unorderedList}>
        {faqByCategory.map(({ title, id }, index) => (
          <li key={index}>
            <Typography component={Link} href={`#${id}`} onClick={scrollIntoView}>
              {title}
            </Typography>
          </li>
        ))}
      </ul>
      <Box my={7}>
        <Divider />
      </Box>

      {faqByCategory.map(({ title, id, contents }, index) => (
        <Box key={index} mb={10}>
          <Typography id={id} variant="h3">
            {title}
          </Typography>
          <FaqAccordion items={contents} />
        </Box>
      ))}
      <Box mb={5}>
        <Typography>
          {t(
            'common:views.FAQ.noAnswer',
            `Didn't find the answer you were looking for? Contact support:`,
          )}{' '}
          <Link href={`mailto:${emailSupport}`}>{emailSupport}</Link>
        </Typography>
      </Box>
    </StyledPage>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const t = i18n?.getFixedT(locale)

  if (!t) {
    throw Error('TFunction not defined.')
  }
  const stripFaq = (isBodyStripped?: boolean) =>
    faq(t).map(({ heading, body, ...props }) => {
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

  const faqByCategory = faqCategories(t).map(({ id, ...props }) => {
    const faqList = stripFaq().filter(({ category }) => category === id)

    return {
      ...props,
      id,
      contents: faqList,
    }
  })
  return {
    props: {
      faqByCategory,
      jsonLd,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
export default Faq
