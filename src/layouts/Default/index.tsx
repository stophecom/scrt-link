import React from 'react'
import { Box } from '@material-ui/core'
import styled from 'styled-components'

import NextNprogress from 'nextjs-progressbar'
import Image from 'next/image'

import { pink } from '@/theme'
import SROnly from '@/components/ScreenreaderOnly'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Link } from '@/components/Link'
import { appTitle } from '@/constants'

export const Container = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
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

type LayoutProps = {
  hideFooter?: boolean
  hideHeader?: boolean
}
const Layout: React.FC<LayoutProps> = ({ children, hideFooter, hideHeader }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <Header hideHeader={hideHeader} />
      <Container>
        <LogoPage href="/">
          <Image width={'100%'} height={'100%'} src="/logo-transparent.svg" alt={appTitle} />
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
