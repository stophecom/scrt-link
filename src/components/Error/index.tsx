import React from 'react'
import Alert from '@material-ui/lab/Alert'
import { Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

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
export const PageError: React.FunctionComponent<PageErrorProps> = ({ error }) => {
  const classes = useStyles()

  return (
    <Page title="An error occured!">
      <Box mb={2}>
        <Alert severity="error">
          <Box className={classes.wordBreak}>{error}</Box>
        </Alert>
      </Box>
      <BaseButton href="/" color="primary" variant="contained">
        Take me home
      </BaseButton>
    </Page>
  )
}
