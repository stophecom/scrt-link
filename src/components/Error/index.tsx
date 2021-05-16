import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

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
  children = (
    <BaseButtonLink href="/" color="primary" variant="contained">
      Take me home
    </BaseButtonLink>
  ),
  ...props
}) => (
  <Page title="An error occured!" {...props}>
    <Box mb={2}>
      <Error error={error} />
    </Box>
    {children}
  </Page>
)
