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

const Container = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const LinkStyled = styled(Link)`
  font-size: 1.2rem;
`

const Legal = styled('div')`
  opacity: 0.7;
  text-align: center;
`

const LinkAbout = styled(Link)`
  text-decoration: underline;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
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
      background: theme.palette.background.paper,
      boxShadow: `inset 0 10px 40px hsl(0deg 0% 0% / 20%)`,
    },
  }),
)

const Layout: React.FC = ({ children }) => {
  const classes = useStyles()
  const [session] = useSession()
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Container>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {session && (
            <Box mr={2}>
              <NoSsr>
                <BaseButton onClick={() => signOut()} variant="text" size="small">
                  Sign out
                </BaseButton>
              </NoSsr>
            </Box>
          )}
          <NextLink href="/account" passHref>
            <BaseButton component="a" color="primary" variant="contained" size="small">
              {session ? session.user.name || 'My account' : 'Sign in'}
            </BaseButton>
          </NextLink>
        </Box>
        <Box mt={3}>
          <NextLink href="/">
            <a>
              <Logo className={classes.logo} />
              <SROnly>{appTitle}</SROnly>
            </a>
          </NextLink>
        </Box>
        {children}
      </Container>
      <Box component="footer" className={classes.footer}>
        <Container>
          <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
            {menu.map(({ href, label }, index) => (
              <NextLink key={index} href={href} passHref>
                <LinkStyled className={classes.linkPadding} color="primary">
                  {label}
                </LinkStyled>
              </NextLink>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" p={2} pt={0}>
            <Stats />
          </Box>
          <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
            <Legal>
              <strong>Scrt.link</strong> let&rsquo;s you share sensitive information online - even
              in case your communications channel itself is insecure. Keep confidentaionl
              information out of email, Slack, Whatsapp or any other chat app. A one-time,
              disposable link guarantees your secrets can only ever be accessed one time. Before
              being destroyed for good.
              <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
                <span className={classes.linkPadding}>
                  ©{new Date().getFullYear()} SANTiHANS GmbH
                </span>
                {about.map(({ href, label }, index) => (
                  <NextLink key={index} href={href} passHref>
                    <LinkAbout className={classes.linkPadding} color="inherit">
                      {label}
                    </LinkAbout>
                  </NextLink>
                ))}
              </Box>
            </Legal>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Layout
