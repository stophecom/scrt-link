import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'
import styled from 'styled-components'

import Seo, { SeoProps } from '@/components/Seo'

const Intro = styled('div')`
  margin-top: 2em;
  font-size: 1.1rem;
`

export interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  intro?: ReactNode
  children: ReactNode
}

const Page = ({ title, subtitle, children, intro, ...seoProps }: PageProps) => {
  return (
    <Box flex={1} marginBottom={9}>
      <Seo title={title} {...seoProps} />
      <Box pt={3} mb={6}>
        <Box mb={1}>
          <Typography variant="h1" noWrap>
            {title}
          </Typography>
        </Box>
        {subtitle && (
          <Typography variant="subtitle1" component="div">
            {subtitle}
          </Typography>
        )}
        {intro && <Intro>{intro}</Intro>}
      </Box>
      {children}
    </Box>
  )
}

export default Page
