import React from 'react'
import theme from '@/theme'

import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { ThemeProvider } from '@mui/system'

interface BaseThemeProviderProps {
  children: React.ReactNode
}

function BaseThemeProvider({ children }: BaseThemeProviderProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default BaseThemeProvider
