import React from 'react'

import Page from '@/components/Page'

import data from '@/data/CookiePolicy.md'

import Markdown from '@/components/Markdown'

const CookiePolicy = () => (
  <Page title="Cookie Policy" subtitle={`Tl;dr: only essentials, no tracking.`}>
    <Markdown source={data} />
  </Page>
)

export default CookiePolicy
