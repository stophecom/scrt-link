import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Link } from '@material-ui/core'

import Page from '@/components/Page'
import ExternalLink from '@/components/ExternalLink'

import { email, twitterLink, twitterHandle } from '@/constants'

const jsonLd = {
  '@context': 'https://www.schema.org',
  '@type': 'LocalBusiness',
  legalName: 'SANTiHANS GmbH',
  description: 'Web development from the future!',
  email: 'info@santihans.com',
  url: 'https://santihans.com',
}

const Contact = () => (
  <Page title="Contact" subtitle={`Get in touch!`} jsonLd={jsonLd}>
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

export default Contact
