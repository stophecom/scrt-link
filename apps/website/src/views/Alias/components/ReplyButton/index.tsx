import React from 'react'

import { Reply as ReplyIcon } from '@mui/icons-material'
import { useTranslation } from 'next-i18next'

import { BaseButtonLink } from '@/components/Link'

const ReplyButton = () => {
  const { t } = useTranslation()
  return (
    <BaseButtonLink href="/" color="secondary" variant="text" startIcon={<ReplyIcon />}>
      {t('common:button.replyWithSecret', 'Reply with a secret')}
    </BaseButtonLink>
  )
}

export default ReplyButton
