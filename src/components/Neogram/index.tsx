import React, { useRef } from 'react'
import { Box, Typography, IconButton, Backdrop, Modal, ModalProps } from '@mui/material'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/system'
import { WindupChildren, Pause, Effect } from 'windups'
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

const ScrollContainer = styled('div')`
  overflow: scroll;
  height: 100%;
  width: 100%;
  padding: 2.5em 1.5em;
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

  // Reference to auto scroll to the newest message
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
          <Container>
            <WindupChildren onFinished={onFinished}>
              <Message variant="subtitle1">
                {lines.map((item, index) => (
                  <span key={index}>
                    {item}
                    <br />
                    <Pause ms={1000} />
                    <Effect fn={scrollToBottom} />
                  </span>
                ))}
              </Message>
              <Typography variant="subtitle1" component="div" color="primary">
                <Pause ms={1000} />
                {destructionMessage && (
                  <>
                    {destructionMessage}
                    <br />
                  </>
                )}
                <Pause ms={100} />
                <Effect fn={scrollToBottom} />
                {countDown.map((item, index) => {
                  return (
                    <span key={index}>
                      {item + 1}…
                      <Pause ms={1000} />
                    </span>
                  )
                })}

                <Pause ms={1000} />
                {'🔥'}
                <Pause ms={1000} />
              </Typography>
            </WindupChildren>
            <Box mt={15} ref={messagesEndRef} />
          </Container>
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
