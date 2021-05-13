import React from 'react'
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import Switch, { SwitchProps } from '@material-ui/core/Switch'

export type BaseSwitchProps = Pick<FormControlLabelProps, 'label'> &
  Omit<SwitchProps, 'onChange'> & {
    onChange: (checked: boolean) => void
  }

function BooleanSwitch({ label, checked, onChange, ...props }: BaseSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked)
          }}
          name="switch"
          color="primary"
          size="small"
          {...props}
        />
      }
      label={label}
    />
  )
}

export default BooleanSwitch
