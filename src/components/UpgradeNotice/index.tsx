import React from 'react'
import { Typography } from '@material-ui/core'

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
  return (
    <Typography variant="body2" component="em">
      Get a{' '}
      <Link href={link} {...(openLinksInNewTab ? { target: '_blank' } : {})}>
        {requiredRole} account
      </Link>{' '}
      to enable this feature.
    </Typography>
  )
}

export default UpgradeNotice
