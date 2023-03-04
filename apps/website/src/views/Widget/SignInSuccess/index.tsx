import React from 'react'
import { Box } from '@mui/material'

import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

const SignInSuccess = () => (
  <Page title="Success" subtitle={`You are signed in! Open the scrt.link browser extension…`}>
    <Box>
      <BaseButton href="/" color="primary" variant="contained" size="large">
        Home
      </BaseButton>
    </Box>
  </Page>
)

export default SignInSuccess
