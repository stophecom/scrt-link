import React from 'react'
import { Typography, Box } from '@material-ui/core'
import Markdown from '@/components/Markdown'

import Page from '@/components/Page'

const Privacy = () => (
  <Page title="Privacy" subtitle={`No ads, no cookies, no tracking, no bullshit.`}>
    <Box mb={6}>
      <Typography variant="h3">Philosophy</Typography>
      <Typography variant="body1">
        <Markdown
          source={`
This project is all about the respect for people's integrity and privacy. We have no interest in you! Not in you as a person, nor in your secrets. We don't care, sorry :) 
`}
        />
      </Typography>
    </Box>
    <Box mb={6}>
      <Typography variant="h3">Analytics</Typography>

      <Typography variant="body1">
        <Markdown
          source={`
We do basic web traffic analytics with [Plausible.io](https://plausible.io/) -  the simple and privacy-friendly alternative to Google Analytics.

- No use of cookies
- Fully compliant with privacy regulations GDPR, CCPA and PECR
- No collection of personal data
- Project is open source
- All analytics data is **publicly available**: [Analytics Dashboard](https://plausible.io/scrt.link)
`}
        />
      </Typography>
    </Box>
  </Page>
)

export default Privacy
