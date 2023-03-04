import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'

import { Alert, Box, CircularProgress, Paper, Typography, Collapse } from '@mui/material'

import { Replay, Share, ExpandLess, ExpandMore } from '@mui/icons-material'
import { RWebShare } from 'react-web-share'

import { MarkdownStyled as Markdown } from '@/components/Markdown'

import CopyToClipboardButton from '@/components/CopyToClipboardButton'
import BaseButton from '@/components/BaseButton'
import BooleanSwitch from '@/components/BooleanSwitch'
import Spacer from '@/components/Spacer'
import { State } from '@/views/Home/index'
import { CustomerFields } from '@/api/models/Customer'
import { emojiShortUrl } from '@/constants'
import { getAbsoluteLocalizedUrl } from '@/utils/localization'

type ResultProps = Pick<State, 'data'> &
  Pick<CustomerFields, 'isEmojiShortLinkEnabled'> & {
    onReset: () => void
  }

const Result: React.FunctionComponent<ResultProps> = ({
  data,
  onReset,
  isEmojiShortLinkEnabled,
}) => {
  const { t, i18n } = useTranslation()
  const alias = data?.alias
  const encryptionKey = data?.encryptionKey
  const readReceiptMethod = data?.readReceiptMethod

  // Form options
  const [isEmojiLinkEnabled, setIsEmojiLinkEnabled] = useState(isEmojiShortLinkEnabled)
  const [isMarkdownEnabled, setIsMarkdownEnabled] = useState(false)
  const [isConfirmationStepSkipped, setIsConfirmationStepSkipped] = useState(false)
  const [isSharingOptionsActive, setIsSharingOptionsActive] = useState(false)
  const [wrap, setWrap] = useState(false)

  const baseUrl = getAbsoluteLocalizedUrl('/l', i18n.language)
  const secretHash = `#${alias}/${encryptionKey}`

  const domain = isEmojiLinkEnabled ? `${emojiShortUrl}/${i18n.language}` : baseUrl
  const queryItems = []

  if (isMarkdownEnabled) {
    queryItems.push('f=md')
  }
  if (isConfirmationStepSkipped) {
    queryItems.push('snap=true')
  }

  const query = queryItems.length ? `?${queryItems.join('&')}` : ''
  const shortenedUrl = alias ? `${domain}${query}${secretHash}` : null

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
            <Paper variant="outlined">
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
                {['email', 'sms', 'ntfy'].includes(readReceiptMethod || '') && (
                  <Box pt={3}>
                    <Alert severity="info">
                      <Typography variant="body2" component={'div'}>
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
                <Collapse in={isSharingOptionsActive}>
                  <Box mt={4} pt={4} borderTop={1} borderColor="grey.800">
                    <Box mb={2}>
                      <Typography variant="h4">
                        {t(
                          'common:components.ShareSecretResult.sharingOptions.title',
                          'Sharing Options',
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <Box py={1}>
                        <BooleanSwitch
                          label={
                            <Box pl={1}>
                              {t(
                                'common:components.ShareSecretResult.emojiLink.label',
                                'Emoji link',
                              )}
                            </Box>
                          }
                          onChange={() => {
                            setIsEmojiLinkEnabled(!isEmojiLinkEnabled)
                          }}
                          checked={isEmojiLinkEnabled}
                        />
                      </Box>
                      <Box py={1}>
                        <BooleanSwitch
                          label={
                            <Box pl={1}>
                              {t(
                                'common:components.ShareSecretResult.skipConfirmation.label',
                                'Instant revelation',
                              )}
                              <Typography
                                fontSize={'[0.9rem]'}
                                component="div"
                                variant="body2"
                                color={'grayText'}
                              >
                                {t(
                                  'common:components.ShareSecretResult.skipConfirmation.info',
                                  'When enabled, the confirmation screen will be skipped. Be aware, this may lead to lost secrets because some apps visit links ahead of time.',
                                )}
                              </Typography>
                            </Box>
                          }
                          onChange={() => {
                            setIsConfirmationStepSkipped(!isConfirmationStepSkipped)
                          }}
                          checked={isConfirmationStepSkipped}
                        />
                      </Box>
                      {data.secretType === 'text' && (
                        <Box py={1}>
                          <BooleanSwitch
                            label={
                              <Box pl={1}>
                                {t(
                                  'common:components.ShareSecretResult.markdown.label',
                                  'Markdown',
                                )}
                                <Typography
                                  fontSize={'[0.9rem]'}
                                  component="div"
                                  variant="body2"
                                  color={'grayText'}
                                >
                                  {t(
                                    'common:components.ShareSecretResult.markdown.info',
                                    'When enabled, the secret text will be rendered as markdown.',
                                  )}
                                </Typography>
                              </Box>
                            }
                            onChange={(value) => {
                              setIsMarkdownEnabled(!isMarkdownEnabled)
                            }}
                            checked={isMarkdownEnabled}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </Paper>
          )}
          <Box p={1} display="flex">
            <Box display="flex" alignItems="center">
              <BaseButton
                endIcon={isSharingOptionsActive ? <ExpandLess /> : <ExpandMore />}
                size="small"
                color="secondary"
                onClick={() => {
                  setIsSharingOptionsActive(!isSharingOptionsActive)
                }}
              >
                {t('common:components.ShareSecretResult.sharingOptions.button', 'Sharing options')}
              </BaseButton>
            </Box>
            <Box ml="auto" px={1} flexShrink={0}>
              <Typography color="textSecondary" variant="caption" component={'div'}>
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
