import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { FileCopyOutlined } from '@mui/icons-material'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import BaseButton, { BaseButtonProps } from '@/components/BaseButton'

interface CopyToClipboardButtonProps extends BaseButtonProps {
  text: string
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({ text, ...button }) => {
  const { t } = useTranslation()
  const [hasCopied, setHasCopied] = useState(false)

  return (
    <CopyToClipboard
      text={text}
      options={{ format: 'text/plain' }}
      onCopy={() => {
        setHasCopied(true)
        setTimeout(() => {
          setHasCopied(false)
        }, 2000)
      }}
    >
      <BaseButton
        startIcon={<FileCopyOutlined />}
        variant="contained"
        color="primary"
        size="large"
        {...button}
      >
        {hasCopied ? t('common:button.copied', 'Copied') : t('common:button.copy', 'Copy')}
      </BaseButton>
    </CopyToClipboard>
  )
}

export default CopyToClipboardButton
