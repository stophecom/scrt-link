import React from 'react'
import { Box, IconButton, Link } from '@material-ui/core'
import styled from 'styled-components'
import TwitterIcon from '@material-ui/icons/Twitter'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

import ExternalLink from './ExternalLink'
import { twitterLink } from '@/constants'

import { menu } from '@/data/menu'

const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const LinkStyled = styled(Link)`
  font-size: 1.2rem;
  padding: ${({ theme }) => theme.spacing(1)}px;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100px',
      height: '100px',

      [theme.breakpoints.up('md')]: {
        width: '150px',
        height: '150px',
      },
    },
  }),
)

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <MainContent>
        <Box mt={3}>
          <Link href="/">
            <Logo className={classes.root} />
            <SROnly>{appTitle}</SROnly>
          </Link>
        </Box>
        {children}
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
          <SROnly>@stophecom</SROnly>
        </IconButton>
      </Box>
    </Box>
  )
}

export default Layout
