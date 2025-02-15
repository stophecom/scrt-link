import React from 'react'
import { Typography } from '@mui/material'
import { Link } from '@mui/material'
import { useTranslation } from 'next-i18next'

import Page from '@/components/Page'

import { ImprintInfo } from '@/views/Imprint'
import { email, emailSupport } from '@/constants'

const jsonLd = {
  '@context': 'https://www.schema.org',
  '@type': 'LocalBusiness',
  legalName: 'SANTiHANS GmbH',
  description: 'Web development from the future!',
  email: 'info@santihans.com',
  url: 'https://santihans.com',
}

const Contact = () => {
  const { t } = useTranslation()
  return (
    <Page
      title={t('common:views.Contact.title', 'Contact')}
      subtitle={t(
        'common:views.Contact.subtitle',
        'Do you have a question or need support? Get in touch!',
      )}
      jsonLd={jsonLd}
    >
      <Typography variant="body1" component={'div'}>
        {t('common:views.Contact.topic.general', 'General inquiries')}:{' '}
        <Link href={`mailto:${email}`}>{email}</Link>
        <br />
        {t('common:views.Contact.topic.support', 'Support')}:{' '}
        <Link href={`mailto:${emailSupport}`}>{emailSupport}</Link>
      </Typography>

      <ImprintInfo />
    </Page>
  )
}

export default Contact
