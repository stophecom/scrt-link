import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import clsx from 'clsx'
import { throttle } from 'throttle-debounce'
import { Box, Divider, Typography } from '@material-ui/core'
import { usePlausible } from 'next-plausible'
import { useSession } from 'next-auth/client'
import { useTranslation } from 'next-i18next'

import { Link } from '@/components/Link'
import BaseButton, { BaseButtonProps } from '@/components/BaseButton'
import SROnly from '@/components/ScreenreaderOnly'
import { LanguageSelector } from '@/components/LanguageSwitcher'
import { main } from '@/data/menu'

const NavigationButton = styled(BaseButton)<BaseButtonProps>`
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

const Hamburger = styled.div`
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
const NavigationInner = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 5px solid ${({ theme }) => theme.palette.primary.main};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 0;
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

const Nav = styled.nav`
  align-items: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 2em 0;
    text-align: center;
  }

  a {
    display: block;
    font-size: clamp(1.6rem, 5vw, 2rem);
    color: ${({ theme }) => theme.palette.text.primary};
    padding: 0.15em 1em;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &.Nav--active {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`

const NavigationWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
`

const LanguageSwitcherWrapper = styled.div`
  position: absolute;
  left: 6px;
  top: 14px;
  display: flex;
  justify-content: center;
`

const NavigationMenu: React.FunctionComponent = () => {
  const router = useRouter()
  const [session] = useSession()
  const { t } = useTranslation()

  return (
    <Nav role="navigation" id="navigation" aria-label="Main navigation menu">
      <ul>
        {main(t).map(({ href, label }, index) => (
          <li key={index}>
            <Link
              href={href}
              key={index}
              className={clsx({ 'Nav--active': router.pathname === href })}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <Box>
        <Divider />
        <Box pt={2}>
          {session ? (
            <Link href="/account">{t('common:button.account', 'Account')}</Link>
          ) : (
            <Link href="/account?signup=true">{t('common:button.getAccount', 'Get Account')}</Link>
          )}
        </Box>
      </Box>
    </Nav>
  )
}

const Navigation = () => {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const plausible = usePlausible()
  const { t } = useTranslation()

  const showNavigation = () => {
    setIsActive(true)
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y')
    const body = document.body
    body.style.position = 'fixed'
    body.style.width = '100%'
    body.style.top = `-${scrollY}`
    plausible('OpenNavigation')
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

    router.events.on('routeChangeStart', () => {
      closeNavigation()
    })

    return () => {
      window.removeEventListener('scroll', scrollHandler)
    }
  })

  return (
    <div>
      <NavigationInner
        className={clsx({
          'Navigation--active': isActive,
        })}
      >
        <NavigationWrapper>
          <NavigationMenu />
          <LanguageSwitcherWrapper>
            <LanguageSelector />
          </LanguageSwitcherWrapper>
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
  )
}

export default Navigation
