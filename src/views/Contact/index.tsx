import React from 'react'
import { Typography } from '@material-ui/core'
import Head from 'next/head'
import { Link } from '@material-ui/core'
import ArrowForward from '@material-ui/icons/ArrowForward'

import Page from '@/components/Page'
import ExternalLink from '@/components/ExternalLink'

import { email, twitterLink, twitterHandle, websiteUrl } from '@/constants'

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
  <Page title="Contact" jsonLd={jsonLd}>
    <Typography variant="subtitle1">Christophe Schwyzer</Typography>
    <Typography>
      <ExternalLink href={`https://www.${websiteUrl}`}>{websiteUrl}</ExternalLink>
      <br />
      <Link href={`mailto:${email}`}>{email}</Link>
      <br />
      <ExternalLink href={twitterLink}>{twitterHandle}</ExternalLink>
    </Typography>
  </Page>
)

export default Faq
