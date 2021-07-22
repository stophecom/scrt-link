import React from 'react'
import { Box, Typography, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { WindupChildren, Pause } from 'windups'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'

import { Container } from '@/layouts/Default'

const Backdrop = styled(Box)`
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    break: {
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    },
  }),
)

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
  const classes = useStyles()
  const countDown = Array.from(Array(timeout).keys()).reverse()

  return (
    <Backdrop>
      <ScrollContainer>
        <WindupChildren onFinished={onFinished}>
          <Typography variant="subtitle1" component="div" className={classes.break}>
            {message}
          </Typography>
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
        <CloseButton color="primary" aria-label="Close" onClick={onFinished}>
          <Close />
        </CloseButton>
      )}
    </Backdrop>
  )
}

export default Neogram
