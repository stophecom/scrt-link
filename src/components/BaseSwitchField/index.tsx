import React, { ReactNode } from 'react'
import { useField, FieldHookConfig } from 'formik'
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import Switch, { SwitchProps } from '@material-ui/core/Switch'
import FormHelperText from '@material-ui/core/FormHelperText'
import { FormControl } from '@material-ui/core'

export type BaseSwitchProps = Partial<FormControlLabelProps> &
  FieldHookConfig<SwitchProps> & { helperText?: ReactNode }

function BaseSwitchField({ label, helperText, ...props }: BaseSwitchProps) {
  const [field, meta] = useField(props)
  const { error, touched } = meta
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  return (
    <FormControl error={hasError}>
      <FormControlLabel
        {...props}
        {...field}
        control={<Switch checked={Boolean(field.value)} color="primary" />}
        label={label}
      />
      {(helperText || hasError) && (
        <FormHelperText error={hasError}>{hasError ? errorMessage : helperText}</FormHelperText>
      )}
    </FormControl>
  )
}

export default BaseSwitchField
