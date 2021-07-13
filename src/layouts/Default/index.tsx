import React from 'react'
import { Box, NoSsr, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSession } from 'next-auth/client'
import { Face } from '@material-ui/icons'
import clsx from 'clsx'
import { useInView } from 'react-intersection-observer'
import NextNprogress from 'nextjs-progressbar'
import Image from 'next/image'

import BaseButton from '@/components/BaseButton'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Link, BaseButtonLink } from '@/components/Link'
import { pink } from '@/theme'
import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import { useCustomer } from '@/utils/api'

// eslint-disable-next-line import/no-webpack-loader-syntax
import logoSource from '@/assets/images/logo.svg'

export const Container = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const HeaderBarInner = styled.div`
  align-items: center;
  display: flex;
  margin: 0 auto;
  max-width: 780px;
  padding-left: ${({ theme }) => theme.spacing(2)}px;
  padding-right: ${({ theme }) => theme.spacing(2)}px;
  width: 100%;
`
const HeaderBarReserveSpace = styled.main`
  height: 60px;
`

const LogoLink = styled(Link)`
  width: 36px;
  height: 36px;
  transform: translate(0, 60px) scale(2.2);
  transform-origin: top left;
  transition: 100ms;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    transform: translate(0, 70px) scale(2.8);
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    transform: translate(0, 80px) scale(3.5);
  }
`

const HeaderBar = styled.div`
  align-items: center;
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.default};
  height: 60px;
  left: 0;
  top: 0;
  position: fixed;
  transition: 200ms 0ms;
  width: 100%;
  z-index: 100;

  &.HeaderBar--scrolled {
    transition-delay: 400ms;
    background-color: ${({ theme }) => theme.palette.background.paper};
  }

  &.HeaderBar--scrolled ${LogoLink} {
    transform: translate(0, 0) scale(1);
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      paddingTop: '110px !important',

      [theme.breakpoints.up('sm')]: {
        paddingTop: '160px !important',
      },

      [theme.breakpoints.up('md')]: {
        paddingTop: '180px !important',
      },
    },
    button: {
      lineHeight: 1,
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

  const { ref, inView } = useInView({
    threshold: 0.9,
  })

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <HeaderBarReserveSpace ref={ref}>
        <HeaderBar className={clsx({ 'HeaderBar--scrolled': !inView })}>
          <HeaderBarInner>
            <LogoLink href="/">
              <Image src={logoSource} alt={appTitle} />
              <SROnly>{appTitle}</SROnly>
            </LogoLink>
            <Box display="flex" marginLeft="auto" alignItems="center">
              {hideHeader || (
                <>
                  {session ? (
                    <NoSsr>
                      <BaseButtonLink
                        className={classes.button}
                        href="/account"
                        color="primary"
                        variant="text"
                        size="small"
                      >
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
                        <BaseButton
                          className={classes.button}
                          href="/account"
                          variant="text"
                          size="small"
                        >
                          Sign in
                        </BaseButton>
                      </Box>
                      <BaseButtonLink
                        className={classes.button}
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
              <Navigation />
            </Box>
          </HeaderBarInner>
        </HeaderBar>
      </HeaderBarReserveSpace>
      <Container className={classes.container}>{children}</Container>
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
