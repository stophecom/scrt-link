import React from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { useTranslation } from 'next-i18next'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'
import { supportedLanguages } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      appearance: 'none',
      background: 'transparent',
      border: 0,
      boxShadow: 'none',
      font: 'inherit',
      color: 'inherit',
      padding: '.2em 1em .2em .4em',
      cursor: 'pointer',
    },
    option: {
      color: '#222222',
    },
    icon: {
      fontSize: '1.1rem',
      flexShrink: 0,
      marginLeft: '0.5rem',
    },
  }),
)

type LanguageSelectorProps = {
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const router = useRouter()
  const classes = useStyles()
  const { t } = useTranslation()

  const { pathname, asPath, query, locale } = router

  return (
    <Box display="inline-flex" alignItems="center">
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
    </Box>
  )
}
