import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Link as MUILink, LinkProps as MUILinkProps } from '@material-ui/core'
import BaseButton, { BaseButtonProps } from '@/components/BaseButton'

type LinkProps = NextLinkProps & MUILinkProps
export const Link: React.FunctionComponent<LinkProps> = ({ href, children, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <MUILink {...props}>{children}</MUILink>
    </NextLink>
  )
}

type BaseButtonLinkProps = NextLinkProps & BaseButtonProps
export const BaseButtonLink: React.FunctionComponent<BaseButtonLinkProps> = ({
  href,
  children,
  ...props
}) => {
  return (
    <NextLink href={href} passHref>
      <BaseButton variant="contained" color="primary" {...props}>
        {children}
      </BaseButton>
    </NextLink>
  )
}
