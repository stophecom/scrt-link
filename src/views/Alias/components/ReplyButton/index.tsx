import React from 'react'
import ReplyIcon from '@material-ui/icons/Reply'
import { usePlausible } from 'next-plausible'

import { BaseButtonLink } from '@/components/Link'

const ReplyButton = () => {
  const plausible = usePlausible()

  return (
    <BaseButtonLink
      href="/"
      color="default"
      variant="text"
      startIcon={<ReplyIcon />}
      onClick={() => plausible('ReplyButton')}
    >
      Reply with a secret
    </BaseButtonLink>
  )
}

export default ReplyButton
