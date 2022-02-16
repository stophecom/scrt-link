import React, { ReactNode } from 'react'
import { useField, FieldHookConfig } from 'formik'
import {
  FormControl,
  FormHelperText,
  Switch,
  SwitchProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material'

export type BaseSwitchProps = Omit<FormControlLabelProps, 'control'> &
  FieldHookConfig<SwitchProps> & { helperText?: ReactNode }

function BaseSwitchField({ label, helperText, ...props }: BaseSwitchProps) {
  const [field, meta] = useField(props)
  const { error, touched } = meta
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        {...field}
        control={<Switch value={true} checked={props.checked} color="primary" />}
        label={label}
      />
      {(helperText || hasError) && (
        <FormHelperText error={hasError}>{hasError ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

export default BaseSwitchField
