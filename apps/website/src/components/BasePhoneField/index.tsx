import React, { useState } from 'react'

import { styled } from '@mui/system'

import {
  InputLabel,
  TextFieldProps,
  FormControlProps,
  FormControl,
  FormHelperText,
} from '@mui/material'
import { useField, FieldHookConfig } from 'formik'
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/material.css'

const PREFIX = 'BasePhoneField'

const classes = {
  container: `${PREFIX}-container`,
  label: `${PREFIX}-label`,
  input: `${PREFIX}-input`,
  dropdown: `${PREFIX}-dropdown`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.container}`]: {
    '& .special-label': { display: 'none !important' },
  },

  [`& .${classes.label}`]: {
    backgroundColor: `${theme.palette.background.paper} !important`,
    paddingLeft: '5px',
    paddingRight: '5px',
    marginLeft: '-5px',
  },

  [`& .${classes.input}`]: {
    borderColor: `rgba(255, 255, 255, 0.23) !important`,
    backgroundColor: `${theme.palette.background.paper} !important`,
    color: `${theme.palette.text.primary} !important`,

    '&.form-control': {
      width: '250px !important',
    },
    '&:hover': {
      borderColor: `${theme.palette.text.primary} !important`,
    },

    '&.focus-visible, &:focus': {
      outline: 'none !important',
      boxShadow: `0 0 0 1px ${theme.palette.primary.main} !important`,
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },

  [`& .${classes.dropdown}`]: {
    backgroundColor: `${theme.palette.background.paper} !important`,
    '& .country.highlight': { backgroundColor: `${theme.palette.background.default} !important` },
  },
}))

export type BasePhoneFieldProps = FormControlProps &
  TextFieldProps &
  FieldHookConfig<TextFieldProps['value']>

const BasePhoneField = ({ label, helperText, disabled, ...props }: BasePhoneFieldProps) => {
  const [field, meta, helpers] = useField(props)
  const [focused, setFocused] = useState(false)
  const { error } = meta
  const { setValue } = helpers

  return (
    <Root>
      <FormControl
        variant="outlined"
        error={!!error}
        focused={focused}
        disabled={disabled}
        {...props}
      >
        <InputLabel className={classes.label} htmlFor="phone-input" shrink>
          {label}
        </InputLabel>
        <PhoneInput
          inputClass={classes.input}
          containerClass={classes.container}
          dropdownClass={classes.dropdown}
          preferredCountries={['us', 'ch']}
          preserveOrder={['preferredCountries']}
          countryCodeEditable={false}
          country="us"
          regions={['north-america', 'europe']}
          autoFormat={true}
          onFocus={() => setFocused(true)}
          inputProps={{
            id: 'phone-input',
            autoComplete: 'tel',
            onBlur: () => setFocused(false),
          }}
          onChange={(value) => setValue(value)}
          value={(field.value ?? '') as string}
          disabled={disabled}
        />

        {error && <FormHelperText id="helper-text">{error}</FormHelperText>}
        {helperText && <FormHelperText error={false}>{helperText}</FormHelperText>}
      </FormControl>
    </Root>
  )
}

export default BasePhoneField
