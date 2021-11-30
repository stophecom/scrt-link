import React, { ReactNode } from 'react'
import { Typography } from '@material-ui/core'
import { Trans } from 'next-i18next'

import { Role } from '@/api/models/Customer'
import { Link } from '@/components/Link'

type UpgradeNoticeProps = {
  requiredRole: Role
  openLinksInNewTab?: boolean
}
const UpgradeNotice: React.FunctionComponent<UpgradeNoticeProps> = ({
  requiredRole,
  openLinksInNewTab,
}) => {
  const link = requiredRole === 'premium' ? '/pricing' : '/account?signup=true'

  type UpgradeLinkProps = {
    children: ReactNode
  }
  const UpgradeLink: React.FC<UpgradeLinkProps> = ({ children }) => (
    <Link href={link} {...(openLinksInNewTab ? { target: '_blank' } : {})}>
      {children}
    </Link>
  )

  return (
    <Typography variant="body2" component="em">
      {requiredRole === 'premium' ? (
        <Trans i18nKey="common:components.UpgradeNotice.premium">
          Get a <UpgradeLink>premium account</UpgradeLink> to enable this feature.
        </Trans>
      ) : (
        <Trans i18nKey="common:components.UpgradeNotice.free">
          Get a <UpgradeLink>free account</UpgradeLink> to enable this feature.
        </Trans>
      )}
    </Typography>
  )
}

export default UpgradeNotice
