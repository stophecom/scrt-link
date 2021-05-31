import React from 'react'
import { Typography, Box } from '@material-ui/core'
import styled from 'styled-components'

import { Link } from '@/components/Link'
import Page from '@/components/Page'

import { emailSantihans } from '@/constants'
import { legal } from '@/data/menu'

const LinkStyled = styled(Link)`
  font-size: 1rem;
`

export const ImprintInfo = () => (
  <Typography>
    SANTiHANS GmbH (The Company)
    <br />
    CH-4056 Basel <br />
    UID: CHE-244.875.499
    <br />
    <Link href={`mailto:${emailSantihans}`}>{emailSantihans}</Link>
  </Typography>
)

const Imprint = () => (
  <Page title="Imprint" subtitle={`Tl;dr: Limited liability.`}>
    <Box mb={4}>
      <ImprintInfo />
    </Box>
    <Box mb={4}>
      <Typography variant="h3">Policies and Terms</Typography>
      <Box component="ul">
        {legal.map(({ href, label }, index) => (
          <li key={index}>
            <LinkStyled href={href} color="primary">
              {label}
            </LinkStyled>
          </li>
        ))}
      </Box>
    </Box>
  </Page>
)

export default Imprint
