import React, { useState, useRef } from 'react'

import IconButton from '@material-ui/core/IconButton'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl, { FormControlProps } from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

import { TextFieldProps } from '@material-ui/core'
import { useField, FieldHookConfig } from 'formik'

export type BasePasswordFieldProps = FormControlProps & FieldHookConfig<TextFieldProps['value']>

const BasePasswordField = (props: BasePasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false)

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

  return (
    <FormControl variant="outlined" error={hasError} {...props}>
      <InputLabel htmlFor="password-input">Password</InputLabel>
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
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        labelWidth={70}
      />
      {errorMessage && <FormHelperText id="helper-text">{errorMessage}</FormHelperText>}
    </FormControl>
  )
}

export default BasePasswordField
