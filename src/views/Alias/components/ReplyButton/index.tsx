import React from 'react'
import ReplyIcon from '@material-ui/icons/Reply'
import NextLink from 'next/link'
import { usePlausible } from 'next-plausible'

import BaseButton from '@/components/BaseButton'

const ReplyButton = () => {
  const plausible = usePlausible()

  return (
    <NextLink href="/" passHref>
      <BaseButton
        color="primary"
        variant="contained"
        size="large"
        startIcon={<ReplyIcon />}
        onClick={() => plausible('ReplyButton')}
      >
        Reply with a secret
      </BaseButton>
    </NextLink>
  )
}

export default ReplyButton
