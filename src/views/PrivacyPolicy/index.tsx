import React from 'react'

import Page from '@/components/Page'

import data from '@/data/PrivacyPolicy.md'
import Markdown from '@/components/Markdown'
import { ImprintInfo } from '@/views/Imprint'

const PrivacyPolicy = () => (
  <Page title="Privacy Policy" subtitle={`Tl;dr: Privacy matters.`}>
    <Markdown source={data} />
    <ImprintInfo />
  </Page>
)

export default PrivacyPolicy
