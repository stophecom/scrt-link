import React from 'react'
import { Typography, Box } from '@mui/material'
import { useTranslation } from 'next-i18next'

import data from '@/data/TermsOfService.md'
import Page from '@/components/Page'
import Markdown from '@/components/Markdown'
import { Menu } from '@/views/Imprint'
import { policies } from '@/data/menu'

const TermsOfService = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.TermsOfService.title', 'Terms Of Service')}
      subtitle={t('common:views.TermsOfService.subtitle', `Tl;dr: Pretty much standard.`)}
      hasMissingTranslations
    >
      <Box mb={10}>
        <Markdown source={data} />
      </Box>

      <Typography variant="h2">{t('common:views.TermsOfService.policies', 'Policies')}</Typography>
      <Menu menu={policies(t)} />
    </Page>
  )
}

export default TermsOfService
