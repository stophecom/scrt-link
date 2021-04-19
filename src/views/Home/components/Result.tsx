import React, { useState, useEffect } from 'react'

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { Box, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import ShareIcon from '@material-ui/icons/Share'
import Refresh from '@material-ui/icons/Refresh'
import { RWebShare } from 'react-web-share'
import Paper from '@material-ui/core/Paper'

import { sanitizeUrl } from '@/utils/index'
import BaseButton from '@/components/BaseButton'
import Spacer from '@/components/Spacer'
import { State } from '../index'
import { isProduction } from '@/config'

const Result = ({ data, onReset }: Pick<State, 'data'> & { onReset: () => void }) => {
  const alias = data?.alias
  const origin = isProduction
    ? `${process.env.NEXT_PUBLIC_SHORT_URL}`
    : `${sanitizeUrl(process.env.NEXT_PUBLIC_BASE_URL)}/l`
  const shortenedUrl = alias ? `${origin}/${alias}` : null

  const [hasCopied, setHasCopied] = useState(false)

  return (
    <Spacer flexDirection="column" spacing={2} marginY={1}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.web-share-fade { color: #1b242e; }`, // For react-web-share
        }}
      />
      {data && (
        <Box my={2}>
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
                      options={{ format: 'text/plain' }}
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
          <Box py={1} display="flex">
            <BaseButton startIcon={<Refresh />} size="small" variant="text" onClick={onReset}>
              Create new secret
            </BaseButton>
            <Box ml="auto" px={1}>
              <Typography color="textSecondary" variant="caption">
                {data?.message || (
                  <>
                    <CircularProgress size=".8em" color="inherit" /> Encrypt and save…
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Spacer>
  )
}

export default Result
