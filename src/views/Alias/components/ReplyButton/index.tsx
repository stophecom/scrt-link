import React from 'react'
import ReplyIcon from '@material-ui/icons/Reply'
import { usePlausible } from 'next-plausible'

import { BaseButtonLink } from '@/components/Link'

const ReplyButton = () => {
  const plausible = usePlausible()

  return (
    <BaseButtonLink
      href="/"
      color="primary"
      variant="text"
      size="large"
      startIcon={<ReplyIcon />}
      onClick={() => plausible('ReplyButton')}
    >
      Reply with a secret
    </BaseButtonLink>
  )
}

export default ReplyButton
