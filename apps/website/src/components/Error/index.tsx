import React from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'
import Page, { PageProps } from '@/components/Page'
import { Info, InfoProps } from '@/components/Info'

type ErrorProps = {
  error: InfoProps['info']
}
export const Error: React.FunctionComponent<ErrorProps> = ({ error }) => {
  return <Info severity="error" info={error} />
}

export const PageError: React.FunctionComponent<ErrorProps & Partial<PageProps>> = ({
  error,
  children,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Page title={t('common:components.Error.defaultTitle', 'An error occurred!')} {...props}>
      <Box mb={2}>
        <Error error={error} />
      </Box>
      {children || (
        <BaseButtonLink href="/" color="primary" variant="contained">
          {t('common:button.takeMeHome', 'Take me home')}
        </BaseButtonLink>
      )}
    </Page>
  )
}
