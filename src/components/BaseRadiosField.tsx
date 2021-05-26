import React from 'react'

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControlLabelProps,
  FormLabel,
  Box,
  FormHelperText,
} from '@material-ui/core'
import FormControl, { FormControlProps } from '@material-ui/core/FormControl'
import { useField, FieldHookConfig } from 'formik'

type Option = {
  value: string | number
  label: string
  disabled?: boolean
}

export type BaseRadiosFieldProps = FormControlProps &
  FieldHookConfig<FormControlLabelProps['value']> & {
    label?: string
    options: Option[]
    helperText?: string
  }

const BaseRadiosField = ({
  label,
  options = [{ value: 'one', label: 'One' }],
  helperText,
  ...props
}: BaseRadiosFieldProps) => {
  const [field, meta] = useField(props)
  const { error, touched } = meta
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  return (
    <div>
      <FormControl component="fieldset" error={hasError} {...props}>
        <Box mb={1}>
          <FormLabel component="legend">
            <strong>{label}</strong>
          </FormLabel>
        </Box>
        <RadioGroup row aria-label={field.name} {...field} defaultValue={options[0].value}>
          {options.map(({ value, label, disabled }, index) => (
            <FormControlLabel
              key={index}
              control={<Radio color="primary" />}
              label={label}
              value={value}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
        {errorMessage && <FormHelperText id="helper-text">{errorMessage}</FormHelperText>}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  )
}

export default BaseRadiosField
