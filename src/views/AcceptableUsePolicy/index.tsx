import React from 'react'

import Page from '@/components/Page'

import data from '@/data/AcceptableUsePolicy.md'

import Markdown from '@/components/Markdown'

const AcceptableUsePolicy = () => (
  <Page title="Acceptable Use Policy" subtitle={`Tl;dr: Play fair.`}>
    <Markdown source={data} />
  </Page>
)

export default AcceptableUsePolicy
