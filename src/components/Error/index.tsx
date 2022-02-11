import React from 'react'
import { styled } from '@mui/system'
import Alert from '@mui/material/Alert'
import { Box } from '@mui/material'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'
import Page, { PageProps } from '@/components/Page'

const PREFIX = 'Error'

const classes = {
  wordBreak: `${PREFIX}-wordBreak`,
}

const StyledPage = styled(Page)(({ theme }) => ({
  [`& .${classes.wordBreak}`]: {
    wordBreak: 'break-word',
  },
}))

type ErrorProps = {
  error: string
}
export const Error: React.FunctionComponent<ErrorProps> = ({ error }) => {
  return (
    <Alert severity="error">
      <Box className={classes.wordBreak}>{error}</Box>
    </Alert>
  )
}

export const PageError: React.FunctionComponent<ErrorProps & Partial<PageProps>> = ({
  error,
  children,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <StyledPage title={t('common:components.Error.defaultTitle', 'An error occurred!')} {...props}>
      <Box mb={2}>
        <Error error={error} />
      </Box>
      {children || (
        <BaseButtonLink href="/" color="primary" variant="contained">
          {t('common:button.takeMeHome', 'Take me home')}
        </BaseButtonLink>
      )}
    </StyledPage>
  )
}
