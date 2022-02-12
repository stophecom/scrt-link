import React from 'react'
import {
  Switch as MUISwitch,
  SwitchProps as MUISwitchProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material'

type SwitchProps = Omit<MUISwitchProps, 'onChange'> & {
  onChange: (checked: boolean) => void
}
export const Switch = ({ checked, onChange, ...props }: SwitchProps) => (
  <MUISwitch
    checked={checked}
    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked)
    }}
    name="switch"
    color="primary"
    size="small"
    {...props}
  />
)

export type BaseSwitchProps = Pick<FormControlLabelProps, 'label'> & SwitchProps
const BooleanSwitch = ({ label, ...props }: BaseSwitchProps) => {
  return <FormControlLabel control={<Switch {...props} />} label={label} />
}

export default BooleanSwitch
