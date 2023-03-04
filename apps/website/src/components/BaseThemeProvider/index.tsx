import React from 'react'
import theme from '@/theme'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/system'

interface BaseThemeProviderProps {
  children: React.ReactNode
}

function BaseThemeProvider({ children }: BaseThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default BaseThemeProvider
