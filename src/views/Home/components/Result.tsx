import React, { useState } from 'react'

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { Box, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ShareIcon from '@material-ui/icons/Share'
import Refresh from '@material-ui/icons/Refresh'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RWebShare } from 'react-web-share'
import Paper from '@material-ui/core/Paper'

import BaseButton from '@/components/BaseButton'
import Spacer from '@/components/Spacer'
import { isServer } from '@/utils'
import { State } from '../index'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      wordBreak: 'break-word',
    },
  }),
)

const Result = ({ data, error }: State) => {
  const classes = useStyles()
  const alias = data?.alias
  const origin = isServer() ? process.env.NEXT_PUBLIC_BASE_URL : window.location.origin
  const shortenedUrl = alias ? `${origin}/l/${alias}` : null

  const [hasCopied, setHasCopied] = useState(false)

  return (
    <Spacer flexDirection="column" spacing={2} marginY={1}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.web-share-fade { color: #1b242e; }`, // For react-web-share
        }}
      />
      {(data || error) && (
        <Box my={2}>
          {error && (
            <Box mb={3}>
              <Alert severity="error">
                <Box className={classes.root}>{error}</Box>
              </Alert>
            </Box>
          )}

          {shortenedUrl && (
            <Paper elevation={3}>
              <Box px={4} pt={4} pb={3}>
                <Box mb={4} display="flex" flexDirection="column">
                  <Typography variant="h4" align="center" component="div" noWrap>
                    {shortenedUrl}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                  <Box mx={1}>
                    <RWebShare
                      data={{
                        text: 'Psssst. Here is a secret.',
                        url: shortenedUrl,
                        title: 'Share your secret link:',
                      }}
                    >
                      <BaseButton startIcon={<ShareIcon />} color="primary" size="large">
                        Share
                      </BaseButton>
                    </RWebShare>
                  </Box>
                  <Box mx={1}>
                    <CopyToClipboard
                      text={shortenedUrl}
                      onCopy={() => {
                        setHasCopied(true)
                        setTimeout(() => {
                          setHasCopied(false)
                        }, 2000)
                      }}
                    >
                      <BaseButton
                        startIcon={<FileCopyOutlinedIcon />}
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        {hasCopied ? 'Copied' : 'Copy'}
                      </BaseButton>
                    </CopyToClipboard>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
          <Box py={1}>
            <BaseButton
              startIcon={<Refresh />}
              size="small"
              variant="text"
              onClick={() => document.location.reload()}
            >
              Create new secret
            </BaseButton>
          </Box>
        </Box>
      )}
    </Spacer>
  )
}

export default Result
