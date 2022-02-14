import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { Link as MUILink, LinkProps as MUILinkProps } from '@mui/material'
import BaseButton, { BaseButtonProps } from '@/components/BaseButton'

export type LinkProps = NextLinkProps & MUILinkProps
export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  prefetch,
  locale,
  children,
  ...props
}) => {
  return (
    <NextLink href={href} locale={locale} prefetch={prefetch} passHref>
      <MUILink {...props}>{children}</MUILink>
    </NextLink>
  )
}

type BaseButtonLinkProps = NextLinkProps & BaseButtonProps
export const BaseButtonLink: React.FunctionComponent<BaseButtonLinkProps> = ({
  href,
  prefetch,
  locale,
  children,
  ...props
}) => {
  return (
    <NextLink href={href} locale={locale} prefetch={prefetch} passHref>
      <BaseButton variant="contained" color="primary" {...props}>
        {children}
      </BaseButton>
    </NextLink>
  )
}
