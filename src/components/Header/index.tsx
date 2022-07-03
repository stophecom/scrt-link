import React from 'react'
import { Box, NoSsr, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import clsx from 'clsx'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import { useCustomer } from '@/utils/api'
import SROnly from '@/components/ScreenreaderOnly'
import Navigation from '@/components/Navigation'

import { Link, BaseButtonLink } from '@/components/Link'
import { appTitle } from '@/constants'

const HeaderBarInner = styled('div')`
  align-items: center;
  display: flex;
  margin: 0 auto;
  max-width: 780px;
  position: relative;
  z-index: 1;
  padding-left: ${({ theme }) => theme.spacing(2)};
  padding-right: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`
const HeaderBarReserveSpace = styled('div')`
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
const HeaderBar = styled('div')`
  align-items: center;
  display: flex;
  background-color: ${({ theme }) => theme.palette.background.default};
  height: 60px;
  left: 0;
  top: 0;
  position: fixed;
  width: 100%;
  z-index: 1200; // theme.zIndex.appBar

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: 200ms 0ms;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
    background-color: ${({ theme }) => theme.palette.background.paper};
  }

  &.HeaderBar--scrolled {
    &::after {
      transition-delay: 100ms;
      opacity: 1;
    }
  }

  &.HeaderBar--scrolled ${LogoHeader} {
    animation: 200ms logo 150ms;
    animation-fill-mode: forwards;
  }
`
type HeaderProps = {
  hideHeader?: boolean
}
const Header: React.FC<HeaderProps> = ({ hideHeader }) => {
  const { customer, isLoading } = useCustomer()
  const { data: session } = useSession()
  const { t } = useTranslation()

  const { ref, inView } = useInView({
    threshold: 0.1,
  })

  return (
    <HeaderBarReserveSpace ref={ref}>
      <HeaderBar className={clsx({ 'HeaderBar--scrolled': !inView })}>
        <HeaderBarInner>
          <LogoHeader href="/">
            <Image src="/logo-transparent.svg" width={36} height={36} alt={appTitle} />
            <SROnly>{appTitle}</SROnly>
          </LogoHeader>
          <Box display="flex" marginLeft="auto" alignItems="center">
            {hideHeader || (
              <>
                {session && !isLoading ? (
                  <NoSsr>
                    <BaseButtonLink href="/account" color="primary" variant="text">
                      <Typography
                        component="span"
                        variant="button"
                        style={{ maxWidth: '150px' }}
                        noWrap
                      >
                        {customer?.name || t('common:button.myAccount', 'My account')}
                      </Typography>
                    </BaseButtonLink>
                  </NoSsr>
                ) : (
                  <BaseButtonLink href="/account" color="primary" variant="text">
                    {t('common:button.signIn', 'Sign in')}
                  </BaseButtonLink>
                )}
              </>
            )}
            <Navigation />
          </Box>
        </HeaderBarInner>
      </HeaderBar>
    </HeaderBarReserveSpace>
  )
}
export default Header
