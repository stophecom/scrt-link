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

type PageErrorProps = {
  error: string
}
export const PageError: React.FunctionComponent<PageErrorProps & Partial<PageProps>> = ({
  error,
  children = (
    <BaseButtonLink href="/" color="primary" variant="contained">
      Take me home
    </BaseButtonLink>
  ),
  ...props
}) => {
  const classes = useStyles()

  return (
    <Page title="An error occured!" {...props}>
      <Box mb={2}>
        <Alert severity="error">
          <Box className={classes.wordBreak}>{error}</Box>
        </Alert>
      </Box>
      {children}
    </Page>
  )
}
