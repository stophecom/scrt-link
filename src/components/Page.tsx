import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

import Seo, { SeoProps } from '@/components/Seo'
// eslint-disable-next-line import/no-webpack-loader-syntax

interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

const Page = ({ title, subtitle, children, ...seoProps }: PageProps) => {
  return (
    <>
      <Seo title={title} {...seoProps} />

      <Box flex={1} marginBottom={9}>
        <Box pt={3} mb={6}>
          <Box mb={2}>
            <Typography variant="h1">{title}</Typography>
          </Box>
          {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
        </Box>
        {children}
      </Box>
    </>
  )
}

export default Page
