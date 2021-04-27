import React, { useState, useRef } from 'react'

import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl, { FormControlProps } from '@material-ui/core/FormControl'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { TextFieldProps } from '@material-ui/core'
import { useField, FieldHookConfig } from 'formik'
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/material.css'

export type BasePhoneFieldProps = FormControlProps &
  TextFieldProps &
  FieldHookConfig<TextFieldProps['value']>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& .special-label': { display: 'none !important' },
    },
    label: {
      backgroundColor: `${theme.palette.background.default} !important`,
      paddingLeft: '5px',
      paddingRight: '5px',
      marginLeft: '-5px',
    },
    input: {
      borderColor: `rgba(255, 255, 255, 0.23) !important`,
      backgroundColor: `${theme.palette.background.default} !important`,
      color: `${theme.palette.text.primary} !important`,

      '&:hover': {
        borderColor: `${theme.palette.text.primary} !important`,
      },

      '&.focus-visible, &:focus': {
        outline: 'none !important',
        boxShadow: `0 0 0 1px ${theme.palette.primary.main} !important`,
        borderColor: `${theme.palette.primary.main} !important`,
      },
    },
    dropdown: {
      backgroundColor: `${theme.palette.background.paper} !important`,
      '& .country.highlight': { backgroundColor: `${theme.palette.background.default} !important` },
    },
  }),
)

const BasePhoneField = ({ label, ...props }: BasePhoneFieldProps) => {
  const classes = useStyles()
  const [field, meta, helpers] = useField(props)
  const [focused, setFocused] = useState(false)
  const { error, touched } = meta
  const { setValue } = helpers
  const hasError = Boolean(error && touched)
  const errorMessage = hasError ? error : undefined

  return (
    <div>
      <FormControl variant="outlined" error={hasError} focused={focused} {...props}>
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
        />
        {errorMessage && <FormHelperText id="helper-text">{errorMessage}</FormHelperText>}
      </FormControl>
    </div>
  )
}

export default BasePhoneField
