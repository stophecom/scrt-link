import React from 'react'
import { Typography, Box } from '@material-ui/core'

import data from '@/data/TermsOfService.md'
import Page from '@/components/Page'
import Markdown from '@/components/Markdown'
import { Menu } from '@/views/Imprint'
import { policies } from '@/data/menu'

const TermsOfService = () => (
  <Page title="Terms Of Service" subtitle={`Tl;dr: Pretty much standard.`}>
    <Box mb={10}>
      <Markdown source={data} />
    </Box>

    <Typography variant="h2">Policies</Typography>
    <Menu menu={policies} />
  </Page>
)

export default TermsOfService
