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
    <Box key="section" py={{ xs: 6, sm: 8 }} {...rest}>
      <Box mb={5} maxWidth="min(100%, 600px)">
        {title && <Typography variant="h2">{title}</Typography>}
        {subtitle && (
          <Typography variant="subtitle2" component="div">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default Section
