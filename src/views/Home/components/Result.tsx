import React, { useState } from 'react'

import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import { Box, Typography } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ShareIcon from '@material-ui/icons/Share'
import Refresh from '@material-ui/icons/Refresh'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import BaseButton from '@/components/BaseButton'
import Spacer from '@/components/Spacer'
import ShareButtons from './ShareButtons'
import UrlQrCode from './UrlQrCode'
import { Bold } from '@/components/StyleUtils'
import { isServer } from '@/utils'
import { State } from '../index'

const qrCodeSize = 256

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
  const shortenedUrl = alias ? `${origin}/${alias}` : null

  const [hasCopied, setHasCopied] = useState(false)
  const [isShareVisible, setIsShareVisible] = useState(false)

  return (
    <Spacer flexDirection="column" spacing={2} marginY={1}>
      {(data || error) && (
        <Box my={2}>
          <Alert severity={error ? 'error' : 'success'}>
            <Box mb={3} className={classes.root}>
              {error || 'Your secret short URL has been created successfully!'}
            </Box>

            {shortenedUrl && (
              <Box display="flex" alignItems="center" flexWrap="wrap">
                <Box mr={1} my={1}>
                  <Typography noWrap>{shortenedUrl}</Typography>
                </Box>
                <Box mr={1}>
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
                      size="small"
                      variant="contained"
                    >
                      {hasCopied ? 'Copied' : 'Copy'}
                    </BaseButton>
                  </CopyToClipboard>
                </Box>
                {isShareVisible || (
                  <Box>
                    <BaseButton
                      startIcon={<ShareIcon />}
                      size="small"
                      variant="contained"
                      onClick={() => setIsShareVisible(true)}
                    >
                      Share
                    </BaseButton>
                  </Box>
                )}
              </Box>
            )}
          </Alert>
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

      {shortenedUrl && isShareVisible && (
        <Box maxWidth={qrCodeSize}>
          <Typography>
            <Bold>QR Code:</Bold>
          </Typography>
          <UrlQrCode url={shortenedUrl} size={qrCodeSize} />
          <ShareButtons url={shortenedUrl} />
        </Box>
      )}
    </Spacer>
  )
}

export default Result
