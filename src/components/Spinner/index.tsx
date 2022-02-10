import React from 'react'

import { Box, Typography, CircularProgress, NoSsr } from '@mui/material'

type SpinnerProps = {
  message?: string
}
export const Spinner: React.FunctionComponent<SpinnerProps> = ({ message }) => (
  <NoSsr>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
      <Box mb={2}>
        <CircularProgress />
      </Box>
      {message && <Typography variant="subtitle2">{message}…</Typography>}
    </Box>
  </NoSsr>
)
