import React from 'react'
import Image from 'next/image'
import { Typography } from '@mui/material'

import { appTitle } from '@/constants'
import { Link, LinkProps } from '@/components/Link'

const Logo: React.FunctionComponent<Partial<LinkProps>> = ({ fontSize, ...props }) => {
  return (
    <Link
      href="/"
      mb={3}
      pt={2}
      display={'flex'}
      alignItems={'center'}
      underline="none"
      color="inherit"
      {...props}
    >
      <Image src="/logo-transparent.svg" width={40} height={40} alt={appTitle} />
      <Typography ml={1} fontWeight={'bold'} fontSize={fontSize}>
        {appTitle}
      </Typography>
    </Link>
  )
}

export default Logo
