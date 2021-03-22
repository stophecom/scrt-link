import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import EmailForm from '@/components/EmailForm'
import Page from '@/components/Page'
import Markdown from '@/components/Markdown'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: '1.2rem',
    },
  }),
)

const body = `
Top secret plan includes:
- Increased 2k character limit for all secret types 
- Read receipts 
- Custom Neogram™ destruction message
- Full API access
`
const TopSecret = () => {
  const classes = useStyles()

  return (
    <Page title="Go 00" subtitle={`Request early access* to our top secret plan!`}>
      <Box mb={4}>
        <Markdown className={classes.root} source={body} />
        *The first 007 customers who request request early access get the premium plan for a full
        year free!
      </Box>
      <EmailForm />
    </Page>
  )
}

export default TopSecret
