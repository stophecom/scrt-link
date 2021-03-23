import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import BetaInviteForm from '@/components/BetaInviteForm'
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
Top secret plan will be priced at **$2/month** and includes:
- Increased 2k character limit for all secret types 
- Read receipts (Get informed when secret has been viewed.)
- Send secret links directly via Email
- Custom Neogram™ destruction message
- Access to the API
`
const TopSecret = () => {
  const classes = useStyles()

  return (
    <Page title="Go 00" subtitle={`Request early access* to our top secret plan!`}>
      <Box mb={4}>
        <Markdown className={classes.root} source={body} />
        *The first 10 customers who request early access get the premium plan for a full year free!
      </Box>
      <BetaInviteForm />
    </Page>
  )
}

export default TopSecret
