import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { WindupChildren, Pause } from 'windups'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { Container } from '@/components/Layout'

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
  z-index: 1;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    break: {
      wordBreak: 'break-word',
    },
  }),
)
type NeogramType = {
  message: string
  timeout?: number
  destructionMessage?: string
}
const Neogram: React.FunctionComponent<NeogramType> = ({
  message,
  timeout = 3,
  destructionMessage = 'This message will self-destruct in…',
}) => {
  const classes = useStyles()
  const countDown = Array.from(Array(timeout).keys()).reverse()
  const router = useRouter()

  return (
    <Backdrop>
      <Container>
        <WindupChildren
          onFinished={() => {
            setTimeout(() => router.push('/'), 1000)
          }}
        >
          <Typography variant="subtitle1" className={classes.break}>
            {message}
          </Typography>
          <Typography variant="subtitle1" color="primary">
            <Pause ms={2000} />
            <br />
            {destructionMessage}
            <br />
            <Pause ms={1000} />
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
            {'Booooom 🔥'}
          </Typography>
        </WindupChildren>
      </Container>
    </Backdrop>
  )
}

export default Neogram
