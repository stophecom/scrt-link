import React from 'react'

import Page from '@/components/Page'

import data from '@/data/TermsOfService.md'

import Markdown from '@/components/Markdown'

const TermsOfService = () => (
  <Page title="Terms Of Service" subtitle={`Tl;dr: Pretty much standard.`}>
    <Markdown source={data} />
  </Page>
)

export default TermsOfService
