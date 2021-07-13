import React from 'react'
import { Box, NoSsr, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSession } from 'next-auth/client'
import { Face } from '@material-ui/icons'

import NextNprogress from 'nextjs-progressbar'

import BaseButton from '@/components/BaseButton'
import Footer from '@/components/Footer'
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
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerBar: {
      minHeight: '30px',
    },
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
  }),
)

type LayoutProps = {
  hideFooter?: boolean
  hideHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({ children, hideFooter, hideHeader }) => {
  const classes = useStyles()
  const { data: customer } = useCustomer()
  const [session] = useSession()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <Container>
        <Box
          className={classes.headerBar}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          {hideHeader || (
            <>
              {session ? (
                <NoSsr>
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
                </NoSsr>
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
            </>
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
      {hideFooter || <Footer />}
    </Box>
  )
}

const LayoutDefault: React.FC = ({ children }) => <Layout>{children}</Layout>

export const LayoutMinimal: React.FC = ({ children }) => (
  <Layout hideFooter hideHeader>
    {children}
  </Layout>
)

export default LayoutDefault
