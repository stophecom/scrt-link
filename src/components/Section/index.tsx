import React, { ReactNode } from 'react'
import { Box, BoxProps, Typography } from '@material-ui/core'

type SectionProps = {
  title?: string
  subtitle?: string
  children: ReactNode
}
const Section: React.FunctionComponent<SectionProps & BoxProps> = ({
  title,
  subtitle,
  children,
  ...rest
}) => {
  return (
    <Box py={9} {...rest}>
      <Box mb={5} maxWidth="min(100%, 600px)">
        {title && <Typography variant="h2">{title}</Typography>}
        {subtitle && <Typography variant="subtitle2">{subtitle}</Typography>}
      </Box>
      {children}
    </Box>
  )
}

export default Section
