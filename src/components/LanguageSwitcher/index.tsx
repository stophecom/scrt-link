import React from 'react'
import { styled } from '@mui/system'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { useTranslation } from 'next-i18next'
import { Box, Typography } from '@mui/material'
import { Language as LanguageIcon } from '@mui/icons-material'

import { Link } from '@/components/Link'

import SROnly from '@/components/ScreenreaderOnly'
import { supportedLanguages } from '@/constants'

const PREFIX = 'LanguageSelector'

const classes = {
  select: `${PREFIX}-select`,
  option: `${PREFIX}-option`,
  icon: `${PREFIX}-icon`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.select}`]: {
    appearance: 'none',
    background: 'transparent',
    border: 0,
    boxShadow: 'none',
    font: 'inherit',
    color: 'inherit',
    padding: '.2em 1em .2em .4em',
    cursor: 'pointer',
  },

  [`& .${classes.option}`]: {
    color: '#222222',
  },

  [`& .${classes.icon}`]: {
    fontSize: '1.1rem',
    flexShrink: 0,
    marginLeft: '0.5rem',
  },
}))

const languageMap = {
  de: 'Deutsch',
  en: 'English',
}
type LanguageKeys = keyof typeof languageMap

// https://nextjs.org/docs/advanced-features/i18n-routing#leveraging-the-next_locale-cookie
const setLocaleCookie = (locale: string): void => {
  const cookies = new Cookies()
  cookies.set('NEXT_LOCALE', locale, { path: '/' })
}

type LanguageSelectorProps = {
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const router = useRouter()

  const { t } = useTranslation()

  const { pathname, asPath, query, locale } = router

  return (
    <StyledBox display="inline-flex" alignItems="center">
      <LanguageIcon className={classes.icon} />
      <SROnly>
        <label htmlFor="LanguageSelector">
          {t('common:components.LanguageSelector.label', 'Select your preferred language')}
        </label>
      </SROnly>
      <select
        id="LanguageSelector"
        className={classes.select}
        onChange={(e) => {
          const language = e.currentTarget.value
          setLocaleCookie(language)
          router.push({ pathname, query }, asPath, { locale: language })
        }}
        value={locale}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language} className={classes.option}>
            {languageMap[language as LanguageKeys] || language.toUpperCase()}
          </option>
        ))}
      </select>
    </StyledBox>
  )
}

type LanguageSwitcherProps = {
  className?: string
  itemClassName?: string
}
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, itemClassName }) => {
  const router = useRouter()

  return (
    <div className={className}>
      {supportedLanguages.map((language) => {
        return language === router.locale ? (
          <Typography key={language} component="span" color="primary" className={itemClassName}>
            {languageMap[language as LanguageKeys] || language.toUpperCase()}
          </Typography>
        ) : (
          <Link
            className={itemClassName}
            key={language}
            href={router.pathname}
            locale={language}
            onClick={() => setLocaleCookie(language)}
          >
            {languageMap[language as LanguageKeys] || language.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}
