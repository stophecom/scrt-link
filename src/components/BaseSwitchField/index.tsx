import React, { ReactNode } from 'react'
import { useField, FieldHookConfig } from 'formik'
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Switch, { SwitchProps } from '@mui/material/Switch'
import FormHelperText from '@mui/material/FormHelperText'
import { FormControl } from '@mui/material'

export type BaseSwitchProps = Pick<FormControlLabelProps, 'label'> &
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
