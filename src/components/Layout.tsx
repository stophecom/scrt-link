import React from 'react'
import { Box, Link } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { signOut, useSession } from 'next-auth/client'
import NoSsr from '@material-ui/core/NoSsr'
import NextLink from 'next/link'

import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import BaseButton from '@/components/BaseButton'
import Stats from '@/components/Stats'

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
          <NoSsr>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <NextLink href="/account" passHref>
                <Link component="a" color="textPrimary">
                  Signed in as {session.user.name || session.user.email}
                </Link>
              </NextLink>
              &nbsp;
              <BaseButton
                onClick={() => signOut()}
                color="primary"
                variant="contained"
                size="small"
              >
                Sign out
              </BaseButton>
            </Box>
          </NoSsr>
        )}
        <Box mt={3}>
          <NextLink href="/">
            <a>
              <Logo className={classes.root} />
              <SROnly>{appTitle}</SROnly>
            </a>
          </NextLink>
        </Box>
        {children}
      </MainContent>
      <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
        {menu.map(({ href, label }, index) => (
          <NextLink key={index} href={href} passHref>
            <LinkStyled className={classes.linkPadding} color="primary">
              {label}
            </LinkStyled>
          </NextLink>
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
          <NextLink key={index} href={href} passHref>
            <LinkAbout className={classes.linkPadding} color="inherit">
              {label}
            </LinkAbout>
          </NextLink>
        ))}
      </Box>
      <Box className={classes.footer} display="flex" justifyContent="center" p={2} pt={0}>
        <Stats />
      </Box>
    </Box>
  )
}

export default Layout
