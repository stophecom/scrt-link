import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Link } from '@material-ui/core'

import Page from '@/components/Page'
import ExternalLink from '@/components/ExternalLink'

import { email, twitterLink, twitterHandle } from '@/constants'

const Faq = () => (
  <Page title="Contact" subtitle={`Get in touch!`}>
    <Box mb={4}>
      <Typography variant="h3">Email</Typography>
      <Typography>
        <Link href={`mailto:${email}`}>{email}</Link>
      </Typography>
    </Box>
    <Typography variant="h3">Twitter</Typography>
    <Typography>
      <ExternalLink href={twitterLink}>{twitterHandle}</ExternalLink>
    </Typography>
  </Page>
)

export default Faq
