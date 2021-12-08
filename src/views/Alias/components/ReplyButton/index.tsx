import React from 'react'
import ReplyIcon from '@material-ui/icons/Reply'
import { usePlausible } from 'next-plausible'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'

const ReplyButton = () => {
  const plausible = usePlausible()
  const { t } = useTranslation()
  return (
    <BaseButtonLink
      href="/"
      color="default"
      variant="text"
      startIcon={<ReplyIcon />}
      onClick={() => plausible('ReplyButton')}
    >
      {t('common:button.replyWithSecret', 'Reply with a secret')}
    </BaseButtonLink>
  )
}

export default ReplyButton
