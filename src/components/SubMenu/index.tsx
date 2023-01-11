import React, { ReactNode } from 'react'
import { Typography, Box, BoxProps } from '@mui/material'
import { styled } from '@mui/system'

import { Link, LinkProps } from '@/components/Link'

const LinkStyled = styled(Link)`
  font-size: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`

interface CustomLink extends LinkProps {
  label: string
}
type SubMenuProps = {
  menu: CustomLink[]
  title: ReactNode
}
export const SubMenu: React.FC<SubMenuProps & Omit<BoxProps, 'title'>> = ({
  title,
  menu,
  children,
  ...box
}) => {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'column'} {...box}>
        <Typography component="div" fontWeight={'bold'} mb={1} pt={3} color="primary">
          {title}
        </Typography>
        {menu.map(({ label, href, prefetch, target, rel }, index) => (
          <LinkStyled
            key={index}
            href={href}
            prefetch={prefetch}
            target={target}
            rel={rel}
            color="inherit"
            underline="hover"
          >
            {label}
          </LinkStyled>
        ))}
      </Box>
      {children}
    </Box>
  )
}

export default SubMenu
