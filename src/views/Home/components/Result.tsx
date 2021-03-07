import React, { useState } from 'react';

import { Box, Typography } from '@material-ui/core';
import BaseButton from '@/components/BaseButton';
import Spacer from '@/components/Spacer';

import ExternalLink from '@/components/ExternalLink';
import ShareButtons from './ShareButtons';
import UrlQrCode from './UrlQrCode';
import Alert from '@material-ui/lab/Alert';
import { Bold } from '@/components/StyleUtils';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ShareIcon from '@material-ui/icons/FileCopyOutlined';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { isServer } from '@/utils';
import { State } from '../index';

const qrCodeSize = 256;

const Result = ({ data, error }: State) => {
  const url = data?.url;
  const alias = data?.alias;
  const origin = isServer()
    ? process.env.NEXT_PUBLIC_BASE_URL
    : window.location.origin;
  const shortenedUrl = alias ? `${origin}/${alias}` : null;

  const [hasCopied, setHasCopied] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);

  return (
    <Spacer flexDirection="column" spacing={2} marginY={1}>
      {(data || error) && (
        <Box marginY={2}>
          <Alert severity={error ? 'error' : 'success'}>
            {error || 'Your secret short URL has been created successfully!'}
          </Alert>
        </Box>
      )}
      {shortenedUrl && (
        <Box>
          <Box display="flex" alignItems="center">
            <Typography noWrap>{shortenedUrl}</Typography>
            <Box marginLeft={1}>
              <CopyToClipboard
                text={shortenedUrl}
                onCopy={() => {
                  setHasCopied(true);
                  setTimeout(() => {
                    setHasCopied(false);
                  }, 2000);
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
              {isShareVisible || (
                <BaseButton
                  startIcon={<ShareIcon />}
                  size="small"
                  variant="contained"
                  onClick={() => setIsShareVisible(true)}
                  ml={2}
                >
                  Share
                </BaseButton>
              )}
            </Box>
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
  );
};

export default Result;
