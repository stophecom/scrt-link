import React, { ReactNode } from 'react'
import { useField, FieldHookConfig } from 'formik'
import {
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormControlLabelProps,
  Checkbox,
  CheckboxProps,
} from '@mui/material'

export type BaseCheckboxProps = Omit<FormControlLabelProps, 'control'> &
  FieldHookConfig<CheckboxProps> & { helperText?: ReactNode }

function BaseCheckboxField({ helperText, ...props }: BaseCheckboxProps) {
  const [field, meta] = useField(props)
  const { error, touched } = meta
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        {...props}
        {...field}
        control={<Checkbox checked={Boolean(field.value)} color="primary" />}
      />
      {(helperText || hasError) && (
        <FormHelperText error={hasError}>{hasError ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

export default BaseCheckboxField
