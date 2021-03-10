import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Typography } from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import { appTitle } from '@/constants'

import SROnly from '@/components/ScreenreaderOnly'
import Seo, { SeoProps } from '@/components/Seo'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

interface PageProps extends SeoProps {
  title: string
  subtitle?: ReactNode
  children: ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100px',
      height: '100px',

      [theme.breakpoints.up('md')]: {
        width: '150px',
        height: '150px',
      },
    },
  }),
)

const Page = ({ title, subtitle, children, ...seoProps }: PageProps) => {
  const classes = useStyles()
  return (
    <>
      <Seo title={title} {...seoProps} />

      <Box flex={1} marginBottom={9} mt={3}>
        <Link href="/">
          <a>
            <Logo className={classes.root} />
            <SROnly>{appTitle}</SROnly>
          </a>
        </Link>
        <Box pt={3} mb={8}>
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
