import React, { useState, useRef, useEffect } from 'react'

import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl, { FormControlProps } from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useTranslation } from 'next-i18next'
import { TextFieldProps } from '@mui/material'
import { useField, FieldHookConfig } from 'formik'

export type BasePasswordFieldProps = FormControlProps & FieldHookConfig<TextFieldProps['value']>

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
    <FormControl variant="outlined" error={hasError} {...props}>
      <InputLabel htmlFor="password-input">{t('common:password', 'Password')}</InputLabel>
      <OutlinedInput
        {...field}
        id="password-input"
        inputRef={inputRef}
        aria-describedby="helper-text"
        type={showPassword ? 'text' : 'password'}
        value={field.value ?? ''}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="large"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {errorMessage && <FormHelperText id="helper-text">{errorMessage}</FormHelperText>}
    </FormControl>
  )
}

export default BasePasswordField
