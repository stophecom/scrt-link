import React from 'react'
import { Typography } from '@material-ui/core'
import { Link } from '@material-ui/core'

import Page from '@/components/Page'
import Section from '@/components/Section'
import ExternalLink from '@/components/ExternalLink'

import { emailEmoji, email, emailSupport, twitterLink, twitterHandle } from '@/constants'

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
    <Section title="Email">
      <Typography variant="body1">
        General inquiries: <Link href={`mailto:${email}`}>{email}</Link>
        <br />
        Support: <Link href={`mailto:${emailSupport}`}>{emailSupport}</Link>
        <br />
        Tech: <Link href={`mailto:${emailEmoji}`}>{emailEmoji}</Link>
        <br />
      </Typography>
    </Section>

    <Typography variant="h2">Twitter</Typography>
    <Typography>
      <ExternalLink href={twitterLink}>{twitterHandle}</ExternalLink>
    </Typography>
  </Page>
)

export default Contact
