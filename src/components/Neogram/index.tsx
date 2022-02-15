import React from 'react'
import { Typography, IconButton, Backdrop } from '@mui/material'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/system'
import { WindupChildren, Pause } from 'windups'
import { useTranslation } from 'next-i18next'

import Modal from '@mui/material/Modal'
import { Container } from '@/layouts/Default'

const StyledBackdrop = styled(Backdrop)`
  background-color: ${({ theme }) => theme.palette.background.paper};
`

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

type NeogramType = {
  message: string
  timeout?: number
  destructionMessage?: string
  onFinished: () => void
  open: boolean
  closable?: boolean
}
const Neogram: React.FunctionComponent<NeogramType> = ({
  message,
  timeout = 0,
  open,
  destructionMessage,
  onFinished,
  closable = false,
}) => {
  const { t } = useTranslation()

  const countDown = Array.from(Array(timeout).keys()).reverse()

  // Split message by newline character to pause between them.
  const lines = message.split(/\r?\n/)
  return (
    <Modal
      open={open}
      onClose={onFinished}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropComponent={StyledBackdrop}
    >
      <ModalInner>
        <ScrollContainer>
          <WindupChildren onFinished={onFinished}>
            <Message variant="subtitle1">
              {lines.map((item) => (
                <>
                  {item}
                  <br />
                  <Pause ms={1000} />
                </>
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
