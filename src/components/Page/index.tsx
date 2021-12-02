import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import Alert from '@material-ui/lab/Alert'

import { Link } from '@material-ui/core'
import { emailSupport } from '@/constants'
import Seo, { SeoProps } from '@/components/Seo'

const Intro = styled('div')`
  margin-top: 2em;
  font-size: 1.1rem;
`

export interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  intro?: ReactNode
  children: ReactNode
  hasMissingTranslations?: boolean
}

const Page = ({
  title,
  subtitle,
  children,
  intro,
  hasMissingTranslations,
  ...seoProps
}: PageProps) => {
  const { t, i18n } = useTranslation()

  return (
    <Box flex={1} marginBottom={9}>
      <Seo title={title} {...seoProps} />
      <Box pt={3} mb={6}>
        <Box mb={1}>
          <Typography variant="h1" noWrap>
            {title}
          </Typography>
        </Box>
        {subtitle && (
          <Typography variant="subtitle1" component="div">
            {subtitle}
          </Typography>
        )}
        {intro && <Intro>{intro}</Intro>}
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
