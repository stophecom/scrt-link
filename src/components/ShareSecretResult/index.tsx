import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material'

import { Replay, Share, ExpandLess, ExpandMore, EmojiEmotions } from '@mui/icons-material'
import { RWebShare } from 'react-web-share'

import Markdown from '@/components/Markdown'
import FormShareSecretLink from '@/components/FormShareSecretLink'
import CopyToClipboardButton from '@/components/CopyToClipboardButton'
import BaseButton from '@/components/BaseButton'
import UpgradeNotice from '@/components/UpgradeNotice'
import Spacer from '@/components/Spacer'
import { State } from '@/views/Home/index'
import { CustomerFields } from '@/api/models/Customer'
import { emojiShortUrl } from '@/constants'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'

type ResultProps = Pick<State, 'data'> &
  Pick<CustomerFields, 'isEmojiShortLinkEnabled' | 'role'> & {
    onReset: () => void
    isStandalone?: boolean
  }

const Result: React.FunctionComponent<ResultProps> = ({
  data,
  onReset,
  isEmojiShortLinkEnabled,
  role,
  isStandalone,
}) => {
  const { t, i18n } = useTranslation()
  const alias = data?.alias
  const encryptionKey = data?.encryptionKey
  const readReceiptMethod = data?.readReceiptMethod

  // Form options
  const [isEmojiLinkEnabled, setIsEmojiLinkEnabled] = useState(isEmojiShortLinkEnabled)
  const [isEmailServiceEnabled, setIsEmailServiceEnabled] = useState(false)
  const [wrap, setWrap] = useState(false)

  const baseUrl = getAbsoluteLocalizedUrl('/l', i18n.language)
  const secretHash = `#${alias}/${encryptionKey}`

  const domain = isEmojiLinkEnabled ? `${emojiShortUrl}/${i18n.language}` : baseUrl
  const shortenedUrl = alias ? `${domain}${secretHash}` : null
  const shortenedUrlEmailService = `${baseUrl}${secretHash}`

  return (
    <Spacer flexDirection="column" spacing={2} marginY={1}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.web-share-fade { color: #1b242e; }`, // For react-web-share
        }}
      />
      {data && (
        <Box my={2}>
          <Box pb={1}>
            <BaseButton
              startIcon={<Replay />}
              size="small"
              variant="text"
              color="secondary"
              onClick={onReset}
            >
              {t('common:button.createNewSecret', 'Create new secret')}
            </BaseButton>
          </Box>
          {shortenedUrl && (
            <Paper elevation={3} variant="outlined">
              <Box px={{ xs: 2, sm: 4 }} pt={4} pb={3} key="paper-inner">
                <Box mb={4} display="flex" flexDirection="column">
                  <Typography
                    id="result-secret-link"
                    variant="h5"
                    align="center"
                    component="div"
                    noWrap={!wrap}
                    style={{ wordBreak: 'break-all' }}
                    onClick={() => setWrap(true)}
                  >
                    {shortenedUrl}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center" flexWrap="wrap">
                  <Box mx={1}>
                    <RWebShare
                      data={{
                        text: t('common:components.ShareSecretResult.webShare.text', {
                          defaultValue: `You received a secret: {{shortenedUrl}} \n \nReply with a secret:`,
                          shortenedUrl,
                        }),
                        title: t(
                          'common:components.ShareSecretResult.webShare.title',
                          'Share your secret link:',
                        ),
                      }}
                    >
                      <BaseButton startIcon={<Share />} color="primary" size="large">
                        {t('common:button.share', 'Share')}
                      </BaseButton>
                    </RWebShare>
                  </Box>
                  <Box mx={1}>
                    <CopyToClipboardButton text={shortenedUrl} />
                  </Box>
                </Box>
                {['email', 'sms'].includes(readReceiptMethod || '') && (
                  <Box pt={3}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <Markdown
                          source={t('common:components.ShareSecretResult.rememberAliasInfo', {
                            defaultValue: `Your Secret ID is **{{ alias }}**.  
Remember it, we use it for the read receipt.`,
                            alias,
                          })}
                        />
                      </Typography>
                    </Alert>
                  </Box>
                )}
                <Collapse in={isEmailServiceEnabled}>
                  <Box mt={4} pt={4} borderTop={1} borderColor="grey.800">
                    <Box mb={2}>
                      <Typography variant="h4">
                        {t(
                          'common:components.ShareSecretResult.emailService.title',
                          'Email service',
                        )}
                      </Typography>
                      <Typography variant="body1">
                        {t(
                          'common:components.ShareSecretResult.emailService.subtitle',
                          'Let us deliver your secret link for you.',
                        )}
                      </Typography>
                    </Box>
                    {['premium', 'free'].includes(role) ? (
                      <FormShareSecretLink secretUrl={shortenedUrlEmailService} />
                    ) : (
                      <UpgradeNotice requiredRole={'free'} openLinksInNewTab={isStandalone} />
                    )}
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          )}
          <Box p={1} display="flex">
            <Box display="flex" alignItems="center">
              <Box mr={1}>
                <IconButton
                  aria-label={t(
                    'common:components.ShareSecretResult.emojiLink.ariaLabel',
                    'Toggle emoji link',
                  )}
                  title={t(
                    'common:components.ShareSecretResult.emojiLink.title',
                    'Toggle emoji link',
                  )}
                  size="small"
                  onClick={() => {
                    setIsEmojiLinkEnabled(!isEmojiLinkEnabled)
                  }}
                >
                  <EmojiEmotions
                    fontSize="inherit"
                    color={isEmojiLinkEnabled ? 'primary' : 'inherit'}
                    style={{ opacity: isEmojiLinkEnabled ? 1 : 0.5 }}
                  />
                </IconButton>
              </Box>
              <BaseButton
                endIcon={isEmailServiceEnabled ? <ExpandLess /> : <ExpandMore />}
                size="small"
                color="secondary"
                onClick={() => {
                  setIsEmailServiceEnabled(!isEmailServiceEnabled)
                }}
              >
                {t('common:components.ShareSecretResult.emailService.title', 'Email service')}
              </BaseButton>
            </Box>
            <Box ml="auto" px={1} flexShrink={0}>
              <Typography color="textSecondary" variant="caption">
                {data?.message || (
                  <>
                    <CircularProgress size=".8em" color="inherit" />{' '}
                    {t('common:components.ShareSecretResult.loading', 'Encrypt and save…')}{' '}
                    {data?.progress && Math.round(data?.progress * 100)} %
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
