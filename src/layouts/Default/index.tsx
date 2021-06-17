import React from 'react'
import { Box, NoSsr, Typography, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSession, signOut } from 'next-auth/client'
import { Face, Twitter } from '@material-ui/icons'

import NextNprogress from 'nextjs-progressbar'

import BaseButton from '@/components/BaseButton'
import { Link, BaseButtonLink } from '@/components/Link'
import { pink } from '@/theme'
import { appTitle, twitterLink, twitterHandle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import Stats from '@/components/Stats'
import { useCustomer } from '@/utils/api'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

import { menu, about } from '@/data/menu'

export const Container = styled.main`
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
      width: '80px',
      height: '80px',

      [theme.breakpoints.up('sm')]: {
        width: '100px',
        height: '100px',
      },

      [theme.breakpoints.up('md')]: {
        width: '120px',
        height: '120px',
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
  const { data: customer } = useCustomer()
  const [session] = useSession()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <Container>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {session ? (
            <NoSsr>
              <Box mr={1}>
                <BaseButton onClick={() => signOut()} variant="text" size="small">
                  Sign out
                </BaseButton>
              </Box>
              <BaseButtonLink href="/account" color="primary" variant="text" size="small">
                <Face fontSize="small" />
                &nbsp;
                <Typography component="span" variant="button" style={{ maxWidth: '150px' }} noWrap>
                  {customer?.name || 'My account'}
                </Typography>
              </BaseButtonLink>
            </NoSsr>
          ) : (
            <NoSsr>
              <Box mr={1}>
                <BaseButton href="/account" variant="text" size="small">
                  Sign in
                </BaseButton>
              </Box>
              <BaseButtonLink
                href="/account?signup=true"
                color="primary"
                variant="text"
                size="small"
              >
                Get account
              </BaseButtonLink>
            </NoSsr>
          )}
        </Box>
        <Box mt={3}>
          <Link href="/">
            {/* @ts-ignore */}
            <Logo className={classes.logo} />
            <SROnly>{appTitle}</SROnly>
          </Link>
        </Box>
        {children}
      </Container>
      <Box component="footer" className={classes.footer}>
        <Container>
          <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
            {menu.map(({ href, label, prefetch }, index) => (
              <LinkStyled
                key={index}
                href={href}
                prefetch={prefetch}
                className={classes.linkPadding}
                color="primary"
              >
                {label}
              </LinkStyled>
            ))}
          </Box>
          <Box key="stats1" display="flex" flexWrap="wrap" justifyContent="center" p={2} pt={0}>
            <Stats />
          </Box>
          <Box display="flex" justifyContent="center">
            <IconButton
              target="_blank"
              href={twitterLink}
              aria-label={twitterHandle}
              title={twitterHandle}
            >
              <Twitter fontSize="inherit" />
            </IconButton>
          </Box>
          <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
            <Legal>
              <strong>Scrt.link</strong> lets you share sensitive information online. Keep
              confidential information out of email, Slack, Teams, Whatsapp or any other
              communication channel. A one-time disposable link guarantees your secrets can only
              ever be accessed once - before being destroyed forever.
              <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
                <span className={classes.linkPadding}>
                  ©{new Date().getFullYear()} SANTiHANS GmbH
                </span>
                {about.map(({ href, label }, index) => (
                  <LinkAbout
                    key={index}
                    href={href}
                    className={classes.linkPadding}
                    color="inherit"
                  >
                    {label}
                  </LinkAbout>
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
