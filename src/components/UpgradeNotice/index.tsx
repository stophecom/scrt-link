import React, { ReactNode } from 'react'
import { Typography } from '@mui/material'
import { Trans } from 'next-i18next'

import { Role } from '@/api/models/Customer'
import { Link, LinkProps } from '@/components/Link'
import { useCustomer } from '@/utils/api'

type UpgradeLinkProps = {
  children: ReactNode
  openLinksInNewTab?: boolean
  href: LinkProps['href']
}
const UpgradeLink: React.FC<UpgradeLinkProps> = ({ children, href, openLinksInNewTab }) => (
  <Link href={href} {...(openLinksInNewTab ? { target: '_blank' } : {})}>
    {children}
  </Link>
)

interface UpgradeNoticeProps extends Pick<UpgradeLinkProps, 'openLinksInNewTab'> {
  requiredRole: Role
}
const UpgradeNotice: React.FunctionComponent<UpgradeNoticeProps> = ({
  requiredRole,
  openLinksInNewTab,
}) => {
  return (
    <Typography variant="body2" component="em">
      {requiredRole === 'premium' ? (
        <Trans i18nKey="common:components.UpgradeNotice.premium">
          Get a
          <UpgradeLink openLinksInNewTab={openLinksInNewTab} href={'/pricing'}>
            premium account
          </UpgradeLink>
          to enable this feature.
        </Trans>
      ) : (
        <Trans i18nKey="common:components.UpgradeNotice.free">
          Get a
          <UpgradeLink openLinksInNewTab={openLinksInNewTab} href={'/signup'}>
            free account
          </UpgradeLink>
          to enable this feature.
        </Trans>
      )}
    </Typography>
  )
}

interface LimitReachedNoticeProps extends Pick<UpgradeLinkProps, 'openLinksInNewTab'> {}
export const LimitReachedNotice: React.FunctionComponent<LimitReachedNoticeProps> = ({
  openLinksInNewTab,
}) => {
  const { isFree } = useCustomer()

  let message = (
    <Trans i18nKey="common:components.UpgradeLimits.default">
      Need more?{' '}
      <UpgradeLink openLinksInNewTab={openLinksInNewTab} href={'/account'}>
        Get a free account
      </UpgradeLink>{' '}
      to increase your limits.
    </Trans>
  )
  if (isFree) {
    message = (
      <Trans i18nKey="common:components.UpgradeLimits.free">
        Need more? See{' '}
        <UpgradeLink openLinksInNewTab={openLinksInNewTab} href={'/pricing'}>
          premium plans
        </UpgradeLink>{' '}
        for more info.
      </Trans>
    )
  }

  return (
    <Typography variant="body2" component="em">
      {message}
    </Typography>
  )
}

export default UpgradeNotice
