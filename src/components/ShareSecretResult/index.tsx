import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { Box, CircularProgress, Paper, Typography, Collapse, IconButton } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import {
  Replay,
  Share,
  ExpandLess,
  ExpandMore,
  FileCopyOutlined,
  EmojiEmotions,
} from '@material-ui/icons'
import { RWebShare } from 'react-web-share'
import Alert from '@material-ui/lab/Alert'

import Markdown from '@/components/Markdown'
import FormShareSecretLink from '@/components/FormShareSecretLink'
import BaseButton from '@/components/BaseButton'
import UpgradeNotice from '@/components/UpgradeNotice'
import Spacer from '@/components/Spacer'
import { State } from '@/views/Home/index'
import { CustomerFields } from '@/api/models/Customer'
import { emojiShortUrl, defaultLanguage } from '@/constants'
import { getBaseURL } from '@/utils'

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
  const [hasCopied, setHasCopied] = useState(false)
  // Form options
  const [isEmojiLinkEnabled, setIsEmojiLinkEnabled] = useState(isEmojiShortLinkEnabled)
  const [isEmailServiceEnabled, setIsEmailServiceEnabled] = useState(false)
  const [wrap, setWrap] = useState(false)

  const baseUrl = `${getBaseURL()}${i18n.language === defaultLanguage ? '' : `/${i18n.language}`}/l`

  const origin = isEmojiLinkEnabled ? emojiShortUrl : baseUrl
  const shortenedUrl = alias ? `${origin}/${alias}#${encryptionKey}` : null
  const shortenedUrlEmailService = `${baseUrl}/${alias}#${encryptionKey}`

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
            <Paper elevation={3}>
              <Box px={{ xs: 2, sm: 4 }} pt={4} pb={3} key="paper-inner">
                <Box mb={4} display="flex" flexDirection="column">
                  <Typography
                    variant="h4"
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
                        startIcon={<FileCopyOutlined />}
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        {hasCopied
                          ? t('common:button.copied', 'Copied')
                          : t('common:button.copy', 'Copy')}
                      </BaseButton>
                    </CopyToClipboard>
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
                    {t('common:components.ShareSecretResult.loading', 'Encrypt and save…')}
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
