import React from 'react'
import { Box, NoSsr, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSession, signOut } from 'next-auth/client'
import { Face } from '@material-ui/icons'

import NextNprogress from 'nextjs-progressbar'

import BaseButton from '@/components/BaseButton'
import { Link, BaseButtonLink } from '@/components/Link'
import { pink } from '@/theme'
import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import { useCustomer } from '@/utils/api'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

export const Container = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      width: '40px',
      height: '40px',
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
        <Box display="flex" alignItems="center" p={2} mb={3}>
          <Link href="/">
            {/* @ts-ignore */}
            <Logo className={classes.logo} />
            <SROnly>{appTitle}</SROnly>
          </Link>
          <Box ml="auto" display="flex" alignItems="center">
            <NoSsr>
              {session ? (
                <>
                  <Box mr={1}>
                    <BaseButton onClick={() => signOut()} variant="text" size="small">
                      Sign out
                    </BaseButton>
                  </Box>
                  <BaseButtonLink href="/account" color="primary" variant="text" size="small">
                    <Face fontSize="small" />
                    &nbsp;
                    <Typography
                      component="span"
                      variant="button"
                      style={{ maxWidth: '150px' }}
                      noWrap
                    >
                      {customer?.name || 'My account'}
                    </Typography>
                  </BaseButtonLink>
                </>
              ) : (
                <>
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
                </>
              )}
            </NoSsr>
          </Box>
        </Box>
        {children}
      </Container>
    </Box>
  )
}

export default Layout
