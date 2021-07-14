import React from 'react'
import { Box, NoSsr, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useSession } from 'next-auth/client'
import { Face } from '@material-ui/icons'
import clsx from 'clsx'
import NextNprogress from 'nextjs-progressbar'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

import { pink } from '@/theme'
import SROnly from '@/components/ScreenreaderOnly'
import BaseButton from '@/components/BaseButton'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Link, BaseButtonLink } from '@/components/Link'
import { appTitle } from '@/constants'
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

const LogoHeader = styled(Link)`
  width: 36px;
  height: 36px;
  opacity: 0;
  transition: 200ms;

  @keyframes logo {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }

    20% {
      opacity: 1;
      transform: scale(0.5);
    }

    70% {
      opacity: 1;
      transform: scale(1.1);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const LogoPage = styled(Link)`
  display: block;
  width: 80px;
  height: 80px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: 100px;
    height: 100px;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    width: 120px;
    height: 120px;
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

  &.HeaderBar--scrolled ${LogoHeader} {
    animation: 300ms logo 900ms;
    animation-fill-mode: forwards;
  }
`

type LayoutProps = {
  hideFooter?: boolean
  hideHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({ children, hideFooter, hideHeader }) => {
  const { data: customer, isLoading } = useCustomer()
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
            <LogoHeader href="/">
              <Image src={logoSource} alt={appTitle} />
              <SROnly>{appTitle}</SROnly>
            </LogoHeader>
            <Box display="flex" marginLeft="auto" alignItems="center">
              {hideHeader || (
                <>
                  {session && !isLoading ? (
                    <NoSsr>
                      <BaseButtonLink href="/account" color="primary" variant="text" size="small">
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
              <Navigation />
            </Box>
          </HeaderBarInner>
        </HeaderBar>
      </HeaderBarReserveSpace>
      <Container>
        <LogoPage href="/">
          <Image src={logoSource} alt={appTitle} />
          <SROnly>{appTitle}</SROnly>
        </LogoPage>

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
