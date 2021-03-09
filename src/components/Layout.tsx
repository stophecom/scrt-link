import React from 'react'
import { Box, IconButton } from '@material-ui/core'

import styled from 'styled-components'
import TwitterIcon from '@material-ui/icons/Twitter'
import { Link } from '@material-ui/core'

import ExternalLink from './ExternalLink'
import { twitterLink } from '@/constants'

import { menu } from '@/data/menu'

const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)}px;
`

const LinkStyled = styled(Link)`
  font-size: 1.2rem;
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const Layout: React.FC = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <MainContent>
        <>{children}</>
      </MainContent>

      <Box display="flex" justifyContent="center" p={2}>
        {menu.map(({ href, label }, index) => (
          <LinkStyled key={index} href={href} color="primary">
            {label}
          </LinkStyled>
        ))}
      </Box>
      <Box display="flex" justifyContent="center" component="footer" p={2}>
        <IconButton component={ExternalLink} href={twitterLink}>
          <TwitterIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Layout
