import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { throttle } from 'throttle-debounce'
import { NoSsr, Box, Grid, Divider, Typography } from '@mui/material'
import TrapFocus from '@mui/base/FocusTrap'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'
import { Person, DiamondOutlined } from '@mui/icons-material'

import { BaseButtonLink } from '@/components/Link'
import { useCustomer } from '@/utils/api'
import { Container } from '@/layouts/Default'
import SubMenu from '@/components/SubMenu'
import Logo from '@/components/Logo'
import BaseButton from '@/components/BaseButton'
import SROnly from '@/components/ScreenreaderOnly'
import { LanguageSelector } from '@/components/LanguageSwitcher'
import { account, secrets, integrations, information, support } from '@/data/menu'

const NavigationButton = styled(BaseButton)`
  align-items: center;
  -webkit-appearance: none;
  background-color: transparent;
  border: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  display: flex;
  margin-left: 1rem;
  position: relative;
  z-index: 300;
`

const Hamburger = styled('div')`
  line-height: inherit;
  margin: 0;
  max-width: 100%;
  overflow: visible;
  padding: 0;
  text-align: inherit;
  text-rendering: inherit;
  vertical-align: inherit;

  margin-left: 0.4rem;
  position: relative;
  height: 30px;
  transition: opacity 0.32s 0.4s;
  width: 30px;

  &::before,
  &::after {
    background-color: currentColor;
    content: '';
    height: 2px;
    left: 20%;
    margin-top: -1px;
    position: absolute;
    top: 50%;
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    width: 80%;
  }

  &::before {
    transform: rotate(0deg) translateY(-5px);
  }

  &::after {
    transform: rotate(0deg) translateY(5px);
  }

  &.Hamburger--active {
    &::before {
      transform: rotate(45deg) translateY(0);
    }
    &::after {
      transform: rotate(-45deg) translateY(0);
    }
    &::before,
    &::after {
      background-color: currentColor;
    }
  }
`
const NavigationInner = styled('div')`
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 5px solid ${({ theme }) => theme.palette.primary.main};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 0;
  padding-top: 3em;
  pointer-events: none;
  position: fixed;
  top: 0;
  transition: 0.55s cubic-bezier(0.52, 0.01, 0.16, 1);
  width: 100%;
  z-index: 110;

  &.Navigation--active {
    opacity: 1;
    pointer-events: auto;
  }
`

const Nav = styled('nav')`
  align-items: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const NavigationWrapper = styled('div')`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
`

const NavigationMenu: React.FunctionComponent = () => {
  const { data: session } = useSession()
  const { customer, isLoading } = useCustomer()
  const { t } = useTranslation()

  return (
    <Nav
      role="navigation"
      id="navigation"
      aria-label={t('common:components.Navigation.ariaLabel', 'Main navigation menu')}
    >
      <Container>
        <Grid container spacing={{ sm: 2 }} mb={8} textAlign={{ xs: 'center', sm: 'left' }}>
          <Grid
            item
            xs={12}
            sm={4}
            display={'flex'}
            alignItems={'start'}
            justifyContent={{ xs: 'center', sm: 'start' }}
          >
            <Box display={'flex'} flexDirection="column">
              <Logo fontSize={['1.4em']} />
              <NoSsr>
                {customer?.role !== 'premium' && (
                  <BaseButtonLink
                    href="/pricing"
                    color="secondary"
                    variant="outlined"
                    startIcon={<DiamondOutlined />}
                  >
                    {t('common:button.goPremium', 'Go Premium')}
                  </BaseButtonLink>
                )}
              </NoSsr>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            display={'flex'}
            mb={{ xs: 3, sm: 0 }}
            justifyContent={{ xs: 'center', sm: 'start' }}
          >
            <SubMenu
              sx={{ '& a': { fontSize: ['1.9rem', '1.6em'] } }}
              menu={secrets(t)}
              title={t('common:menu.title.createSecret', 'Create secret')}
            />
          </Grid>
          <Grid item xs={12} sm={4} display={'flex'} justifyContent={{ xs: 'center', sm: 'start' }}>
            <SubMenu
              sx={{ '& a': { fontSize: ['1.9rem', '1.6em'] } }}
              menu={account(t, !!session)}
              title={
                <Box display={'inline-flex'} alignItems="center">
                  <Person sx={{ marginRight: '.2em' }} />
                  {t('common:menu.title.account', 'Account')}
                </Box>
              }
            />
          </Grid>
        </Grid>

        <Divider />

        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          mb={5}
          mt={{ xs: 3, sm: 0 }}
          textAlign={{ xs: 'center', sm: 'left' }}
        >
          <Grid
            item
            xs={12}
            sm={4}
            mb={{ xs: 2, sm: 0 }}
            display={'flex'}
            justifyContent={{ xs: 'center', sm: 'start' }}
          >
            <SubMenu
              sx={{ '& a': { fontSize: ['1.4rem', '1em'] } }}
              menu={integrations}
              title={t('common:menu.title.integrations', 'Integrations')}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            mb={{ xs: 2, sm: 0 }}
            display={'flex'}
            justifyContent={{ xs: 'center', sm: 'start' }}
          >
            <SubMenu
              sx={{ '& a': { fontSize: ['1.4rem', '1em'] } }}
              menu={information(t)}
              title={t('common:menu.title.information', 'Information')}
            />
          </Grid>
          <Grid item xs={12} sm={4} display={'flex'} justifyContent={{ xs: 'center', sm: 'start' }}>
            <SubMenu
              sx={{ '& a': { fontSize: ['1.4rem', '1em'] } }}
              menu={support(t)}
              title={t('common:menu.title.support', 'Support')}
            />
          </Grid>
        </Grid>
      </Container>
    </Nav>
  )
}

const Navigation = () => {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const { t } = useTranslation()

  const showNavigation = () => {
    setIsActive(true)
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y')
    const body = document.body
    body.style.position = 'fixed'
    body.style.width = '100%'
    body.style.top = `-${scrollY}`
  }

  const closeNavigation = () => {
    const body = document.body
    const scrollY = body.style.top
    body.style.position = ''
    body.style.top = ''
    window.scrollTo(0, parseInt(scrollY || '0') * -1)
    setIsActive(false)
  }

  const scrollHandler = throttle(100, () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`)
  })

  useEffect(() => {
    window.addEventListener('scroll', scrollHandler)

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeNavigation()
      }
    })

    router.events.on('routeChangeStart', () => {
      closeNavigation()
    })

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  return (
    <TrapFocus open={isActive}>
      <div>
        <NavigationInner
          className={clsx({
            'Navigation--active': isActive,
          })}
        >
          <NavigationWrapper>
            <NavigationMenu />
            <Box display={'flex'} justifyContent={'center'} my={2}>
              <LanguageSelector />
            </Box>
          </NavigationWrapper>
          <Box p={1}>
            <BaseButton color="primary" onClick={closeNavigation}>
              {t('common:button.close', 'Close')}
            </BaseButton>
          </Box>
        </NavigationInner>
        <NavigationButton
          aria-label={
            isActive
              ? t('common:button.closeMenu', 'Close menu')
              : t('common:button.openMenu', 'Open menu')
          }
          aria-controls="navigation"
          onClick={isActive ? closeNavigation : showNavigation}
        >
          <Typography variant="button">{t('common:button.menu', 'Menu')}</Typography>
          <Hamburger
            className={clsx({
              'Hamburger--active': isActive,
            })}
          >
            <SROnly>
              {isActive
                ? t('common:button.closeMenu', 'Close menu')
                : t('common:button.openMenu', 'Open menu')}
            </SROnly>
          </Hamburger>
        </NavigationButton>
      </div>
    </TrapFocus>
  )
}

export default Navigation
