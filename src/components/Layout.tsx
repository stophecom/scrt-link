import React from 'react'
import { Box, Link } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { signOut, useSession } from 'next-auth/client'

import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import BaseButton from '@/components/BaseButton'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

import { menu, about } from '@/data/menu'

const MainContent = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const LinkStyled = styled(Link)`
  font-size: 1.2rem;
`

const LinkAbout = styled(Link)`
  text-decoration: underline;
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
    linkPadding: {
      padding: theme.spacing(1),
    },
    footer: {
      opacity: 0.8,
    },
  }),
)

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()
  const [session] = useSession()
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <MainContent>
        {session && (
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            Signed in as {session.user.email}&nbsp;
            <BaseButton onClick={() => signOut()} color="primary" variant="contained" size="small">
              Sign out
            </BaseButton>
          </Box>
        )}
        <Box mt={3}>
          <Link href="/">
            <Logo className={classes.root} />
            <SROnly>{appTitle}</SROnly>
          </Link>
        </Box>
        {children}
      </MainContent>
      <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
        {menu.map(({ href, label }, index) => (
          <LinkStyled className={classes.linkPadding} key={index} href={href} color="primary">
            {label}
          </LinkStyled>
        ))}
      </Box>
      <Box
        className={classes.footer}
        display="flex"
        justifyContent="center"
        component="footer"
        flexWrap="wrap"
        p={2}
      >
        <span className={classes.linkPadding}>©{new Date().getFullYear()} SANTiHANS GmbH</span>
        {about.map(({ href, label }, index) => (
          <LinkAbout className={classes.linkPadding} key={index} href={href} color="inherit">
            {label}
          </LinkAbout>
        ))}
      </Box>
    </Box>
  )
}

export default Layout
