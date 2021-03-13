import React from 'react'
import { Box } from '@material-ui/core'

import BaseButton from '@/components/BaseButton'
import Page from '@/components/Page'

const Error = () => (
  <Page title="Error 500" subtitle={`Sorry, something went wrong.`}>
    <Box>
      <BaseButton href="/" color="primary" variant="contained" size="large">
        Home
      </BaseButton>
    </Box>
  </Page>
)

export default Error
