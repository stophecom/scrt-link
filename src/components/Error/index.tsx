import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'
import Page, { PageProps } from '@/components/Page'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wordBreak: {
      wordBreak: 'break-word',
    },
  }),
)

type ErrorProps = {
  error: string
}
export const Error: React.FunctionComponent<ErrorProps> = ({ error }) => {
  const classes = useStyles()

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
