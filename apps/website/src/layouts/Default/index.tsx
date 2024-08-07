import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { styled } from '@mui/system'

import NextNprogress from 'nextjs-progressbar'
import Image from 'next/image'

import { pink } from '@/theme'
import SROnly from '@/components/ScreenreaderOnly'
import { CSPostHogProvider } from '@/providers/posthog'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Link } from '@/components/Link'
import { appTitle } from '@/constants'

export const Container = styled('main')`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
`

const LogoPage = styled(Link)`
  position: relative;
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

type LayoutProps = {
  hideFooter?: boolean
  hideHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({ children, hideFooter, hideHeader }) => {
  useEffect(() => {
    console.info(
      '%c🤫',
      'font-weight: bold; font-size: 50px;color: #ff0083; text-shadow: 3px 3px 0 rgba(0,0,0,0.3)',
    )
    console.info(
      '%cUse promo code HIDDENTREASURE during checkout!',
      'font-size: 20px;color: #ff0083',
    )
  }, [])

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <Header hideHeader={hideHeader} />
      <Container>
        <LogoPage href="/">
          <Image fill src="/logo-transparent.svg" alt={appTitle} />
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
    <CSPostHogProvider>{children}</CSPostHogProvider>
  </Layout>
)

export default LayoutDefault
