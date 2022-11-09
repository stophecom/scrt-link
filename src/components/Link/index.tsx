import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Link as MUILink, LinkProps as MUILinkProps } from '@mui/material'
import BaseButton, { BaseButtonProps } from '@/components/BaseButton'

export type LinkProps = NextLinkProps & MUILinkProps
export const Link: React.FunctionComponent<LinkProps> = ({ children, ...props }) => {
  return (
    <MUILink component={NextLink} {...props}>
      {children}
    </MUILink>
  )
}

type BaseButtonLinkProps = NextLinkProps & BaseButtonProps
export const BaseButtonLink: React.FunctionComponent<BaseButtonLinkProps> = ({
  children,
  ...props
}) => {
  return (
    <BaseButton variant="contained" color="primary" LinkComponent={NextLink} {...props}>
      {children}
    </BaseButton>
  )
}
