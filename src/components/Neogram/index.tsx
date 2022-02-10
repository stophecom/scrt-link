import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
import { styled } from '@mui/system'
import { WindupChildren, Pause } from 'windups'
import { useTranslation } from 'next-i18next'

import { Container } from '@/layouts/Default'

const StyledBackdrop = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  display: flex;
  height: 100%;
  left: 0;
  opacity: 1;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  position: fixed;
  top: 0;
  transition: 700ms;
  width: 100%;
  z-index: 400;
`

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 5px;
  right: 5px;
`

const ScrollContainer = styled(Container)`
  overflow: scroll;
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
  closable?: boolean
}
const Neogram: React.FunctionComponent<NeogramType> = ({
  message,
  timeout = 0,
  destructionMessage,
  onFinished,
  closable = false,
}) => {
  const { t } = useTranslation()

  const countDown = Array.from(Array(timeout).keys()).reverse()

  return (
    <StyledBackdrop>
      <ScrollContainer>
        <WindupChildren onFinished={onFinished}>
          <Message variant="subtitle1">{message}</Message>
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
    </StyledBackdrop>
  )
}

export default Neogram
