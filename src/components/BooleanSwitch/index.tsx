import React from 'react'
import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import MUISwitch, { SwitchProps as MUISwitchProps } from '@material-ui/core/Switch'

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
