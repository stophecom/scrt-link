import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

import Seo, { SeoProps } from '@/components/Seo'

interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

const Page = ({ title, subtitle, children, ...seoProps }: PageProps) => {
  return (
    <Box flex={1} marginBottom={9}>
      <Seo title={title} {...seoProps} />
      <Box pt={3} mb={6}>
        <Box mb={1}>
          <Typography variant="h1">{title}</Typography>
        </Box>
        {subtitle && (
          <Typography variant="subtitle1" component="h2">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default Page
