import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Typography } from '@material-ui/core'
import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import Seo, { SeoProps } from '@/components/Seo'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

interface PageProps extends SeoProps {
  title: string
  children: ReactNode
}

const Page = ({ title, children, ...seoProps }: PageProps) => (
  <>
    <Seo title={title} {...seoProps} />

    <Box flex={1} marginBottom={9} mt={5}>
      <Link href="/">
        <a>
          <Logo width="100px" height="100px" />
          <SROnly>{appTitle}</SROnly>
        </a>
      </Link>
      <Box pt={3} mb={2}>
        <Typography variant="h1">{title}</Typography>
      </Box>
      {children}
    </Box>
  </>
)

export default Page
