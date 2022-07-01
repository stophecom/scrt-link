import React, { ReactNode } from 'react'
import { Alert, Box, Link, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import { MarkdownRaw } from '@/components/Markdown'
import { emailSupport } from '@/constants'
import Seo, { SeoProps } from '@/components/Seo'

const Intro = styled(MarkdownRaw)`
  margin-top: 2em;
  font-size: 1.2rem;
`
const H1 = styled(Typography)`
  hyphens: auto;
`

const Beta = styled('sup')`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 0.4em;
  position: relative;
  bottom: 10px;
  margin-left: 0.5em;
`

export interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  intro?: string //Markdown
  children: ReactNode
  hasMissingTranslations?: boolean
  isBeta?: boolean
}

const Page = ({
  title,
  subtitle,
  children,
  intro,
  hasMissingTranslations,
  isBeta,
  ...seoProps
}: PageProps) => {
  const { t, i18n } = useTranslation()

  return (
    <Box flex={1} marginBottom={9}>
      <Seo title={title} {...seoProps} />
      <Box pt={3} mb={6}>
        <Box mb={1}>
          <H1 variant="h1">
            {title}
            {isBeta && <Beta>BETA</Beta>}
          </H1>
        </Box>
        {subtitle && (
          <Typography variant="subtitle1" component="div">
            {subtitle}
          </Typography>
        )}
        {intro && <Intro source={intro} />}
      </Box>
      {hasMissingTranslations && i18n.language !== 'en' && (
        <Box mb={1}>
          <Alert severity="info">
            {t(
              'common:missingTranslationsNotice',
              'Dear customer, unfortunately some content on this page has not been translated to your preferred language yet. We are working on it. In the meantime, if you have any questions or need further assistance, please contact support.',
            )}{' '}
            <Link href={`mailto:${emailSupport}`}>{emailSupport}</Link>
          </Alert>
        </Box>
      )}
      {children}
    </Box>
  )
}

export default Page
