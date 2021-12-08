import React from 'react'
import { Box } from '@material-ui/core'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'
import Page from '@/components/Page'

const Error = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.Error.title', {
        defaultValue: 'Error {{statusCode}}',
        statusCode: '500',
      })}
      subtitle={t('common:views.Error.subtitle', `Sorry, something went wrong.`)}
    >
      <Box>
        <BaseButtonLink href="/" color="primary" variant="contained" size="large">
          {t('common:button.home', 'Home')}
        </BaseButtonLink>
      </Box>
    </Page>
  )
}
export default Error
