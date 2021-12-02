import React from 'react'
import { Box } from '@material-ui/core'
import { useTranslation } from 'next-i18next'

import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

const Error = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.Error.title', {
        defaultValue: 'Error {{statusCode}}',
        statusCode: '400',
      })}
      subtitle={t('common:views.Error.subtitle', `Sorry, something went wrong.`)}
    >
      <Box>
        <BaseButton href="/" color="primary" variant="contained" size="large">
          {t('common:button.home', 'Home')}
        </BaseButton>
      </Box>
    </Page>
  )
}
export default Error
