import React, { useState, useRef, useEffect } from 'react'

import { IconButton, InputAdornment, TextFieldProps, TextField } from '@mui/material'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { useField, FieldHookConfig } from 'formik'

export type BasePasswordFieldProps = TextFieldProps & FieldHookConfig<TextFieldProps['value']>

const BasePasswordField = (props: BasePasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useTranslation()
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const [field, meta] = useField(props)
  const { error, touched } = meta
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  const inputRef = useRef<HTMLInputElement>()

  const { autoFocus } = props

  // To make autoFocus work with Next.js
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  return (
    <TextField
      {...{ ...props, ...field, variant: props.variant ?? 'outlined' }}
      label={t('common:password', 'Password')}
      id="password-input"
      inputRef={inputRef}
      aria-describedby="helper-text"
      type={showPassword ? 'text' : 'password'}
      value={field.value ?? ''}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={t(
                'common:components.BasePasswordField.ariaLabel',
                'Toggle password visibility',
              )}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={hasError}
      helperText={errorMessage || props.helperText}
    />
  )
}

export default BasePasswordField
