import { Link, LinkProps } from '@mui/material'
import React from 'react'
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { styled } from '@mui/system'

const LinkIcon = styled(ExitToAppIcon)`
  vertical-align: text-bottom;
`

type ExternalLinkProps = LinkProps & { hasIcon?: boolean }

const ExternalLink: React.FC<ExternalLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(function ExternalLink({ children, href, hasIcon, ...rest }, ref) {
  return (
    <Link ref={ref} {...rest} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      {hasIcon && <LinkIcon fontSize="small" />}
    </Link>
  )
})

export default ExternalLink
