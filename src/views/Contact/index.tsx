import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { Link } from '@material-ui/core'

import Page from '@/components/Page'
import ExternalLink from '@/components/ExternalLink'

import { email, twitterLink, twitterHandle, websiteUrl, gitlab, github } from '@/constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  author: {
    '@type': 'Person',
    givenName: 'Christophe',
    familyName: 'Schwyzer',
    email: `mailto:${email}`,
    affiliation: ['Denkmal.org, SANTiHANS GmbH, Creadi AG, Taktwerk GmbH'],
    knowsLanguage: 'en, de, fr',
    jobTitle: 'Senior frontend web developer',
    gender: 'https://schema.org/Male',
    description: 'Senior frontend web developer and user interface designer.',
    worksFor: ['Denkmal.org, SANTiHANS GmbH, Creadi AG, Taktwerk GmbH'],
    url: 'https://www.linkedin.com/in/christophe-schwyzer-19b9193b',
  },
}

const Faq = () => (
  <Page title="Contact" subtitle={`Hi, it's Christophe, get in touch!`} jsonLd={jsonLd}>
    <Box mb={4}>
      <Typography variant="h3">Email</Typography>
      <Typography>
        <Link href={`mailto:${email}`}>{email}</Link>
      </Typography>
    </Box>
    <Box mb={4}>
      <Typography variant="h3">Web</Typography>
      <Typography>
        <ExternalLink href={`https://www.${websiteUrl}`}>{websiteUrl}</ExternalLink>
      </Typography>
    </Box>
    <Box mb={4}>
      <Typography variant="h3">Social</Typography>
      <Typography>
        <ExternalLink href={twitterLink}>{twitterHandle}</ExternalLink>
        <br />
        <ExternalLink href={gitlab}>Gitlab</ExternalLink>
        <br />
        <ExternalLink href={github}>Github</ExternalLink>
      </Typography>
    </Box>
  </Page>
)

export default Faq
