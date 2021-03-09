import React from 'react'
import { Box, IconButton } from '@material-ui/core'

import styled from 'styled-components'
import TwitterIcon from '@material-ui/icons/Twitter'

import ExternalLink from './ExternalLink'
import { twitterLink } from '@/constants'

const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)}px;
`

const Layout: React.FC = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <MainContent>
        <>{children}</>
      </MainContent>

      <Box
        display="flex"
        padding={1}
        justifyContent="center"
        component="footer"
        p={2}
      >
        <IconButton component={ExternalLink} href={twitterLink}>
          <TwitterIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Layout
