import React, { ReactNode } from 'react'

import { Box, Alert, AlertProps } from '@mui/material'

export type InfoProps = {
  info: ReactNode
  severity?: AlertProps['severity']
}
export const Info: React.FunctionComponent<InfoProps> = ({ info, severity = 'info' }) => {
  return (
    <Alert severity={severity}>
      <Box sx={{ wordBreak: 'break-word' }}>{info}</Box>
    </Alert>
  )
}
