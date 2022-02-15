import React from 'react'
import { Typography, IconButton, Backdrop, Modal, ModalProps } from '@mui/material'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/system'
import { WindupChildren, Pause } from 'windups'
import { useTranslation } from 'next-i18next'

import { Container } from '@/layouts/Default'

const ModalInner = styled('div')`
  position: relative;
  height: 100%;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`

const ScrollContainer = styled(Container)`
  overflow: scroll;
  height: 100%;
  width: 100%;
  padding-top: 2.5em;
  padding-bottom: 2.5em;
`

const Message = styled(Typography)`
  word-break: break-word;
  white-space: pre-wrap;
`

interface NeogramType extends Omit<ModalProps, 'children'> {
  message: string
  timeout?: number
  destructionMessage?: string
  onFinished: () => void
  closable?: boolean
}
const Neogram: React.FunctionComponent<NeogramType> = ({
  message,
  timeout = 0,
  destructionMessage,
  closable = false,
  onFinished,
  ...props
}) => {
  const { t } = useTranslation()

  const countDown = Array.from(Array(timeout).keys()).reverse()

  // Split message by newline character to pause between them.
  const lines = message.split(/\r?\n/)
  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{
        sx: {
          backgroundColor: `background.paper`,
        },
      }}
      onClose={closable ? onFinished : undefined}
      {...props}
    >
      <ModalInner>
        <ScrollContainer>
          <WindupChildren onFinished={onFinished}>
            <Message variant="subtitle1">
              {lines.map((item, index) => (
                <span key={index}>
                  {item}
                  <br />
                  <Pause ms={1000} />
                </span>
              ))}
            </Message>
            <Typography variant="subtitle1" component="div" color="primary">
              <Pause ms={1000} />
              <br />
              {destructionMessage && (
                <>
                  {destructionMessage}
                  <br />
                </>
              )}
              <Pause ms={100} />
              {countDown.map((item, index) => {
                return (
                  <span key={index}>
                    {item + 1}…
                    <Pause ms={1000} />
                  </span>
                )
              })}
              <br />
              <Pause ms={1000} />
              {'🔥'}
              <Pause ms={1000} />
            </Typography>
          </WindupChildren>
        </ScrollContainer>
        {closable && (
          <CloseButton
            color="primary"
            aria-label={t('common:button.close', 'Close')}
            onClick={onFinished}
          >
            <Close />
          </CloseButton>
        )}
      </ModalInner>
    </Modal>
  )
}

export default Neogram
