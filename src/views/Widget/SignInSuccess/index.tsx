import React from 'react'
import { Box } from '@material-ui/core'

import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

const SignInSuccess = () => (
  <Page title="Success" subtitle={`You are signed in! Open Chrome Extension.`}>
    <Box>
      <BaseButton href="/" color="primary" variant="contained" size="large">
        Home
      </BaseButton>
    </Box>
  </Page>
)

export default SignInSuccess
