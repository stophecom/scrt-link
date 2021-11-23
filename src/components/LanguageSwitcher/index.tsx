import React from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import nextI18NextConfig from 'next-i18next.config.js'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'

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
      padding: '0 1em 0 .4em',
      cursor: 'pointer',
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

  const { pathname, asPath, query } = router

  return (
    <Box display="inline-flex" alignItems="center">
      <LanguageIcon className={classes.icon} />
      <select
        className={classes.select}
        onChange={(e) => {
          const lang = e.currentTarget.value
          router.push({ pathname, query }, asPath, { locale: lang })
        }}
      >
        {nextI18NextConfig.i18n.locales.map((language) => (
          <option key={language} value={language}>
            {languageMap[language as LanguageKeys] || language.toUpperCase()}
          </option>
        ))}
      </select>
    </Box>
  )
}
