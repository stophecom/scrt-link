import React, { useEffect, useReducer } from 'react'
import dynamic from 'next/dynamic'
import { Box, Paper, Typography, NoSsr, Backdrop } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { styled } from '@mui/system'
import Image from 'next/image'
import { useTranslation, Trans } from 'next-i18next'
import { useInView } from 'react-intersection-observer'

import WidgetLayout from '@/layouts/Widget'
import { Maybe, CustomPage } from '@/types'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { PageError } from '@/components/Error'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import Page from '@/components/Page'
import Section from '@/components/Section'
import BoxShadowWrapper from '@/components/BoxShadowWrapper'
import UnorderedList from '@/components/UnorderedList'
import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'

import Trust from './components/Trust'
import { slackAppInstallLink } from '@/constants'
import { useCustomer } from '@/utils/api'
import { ReadReceiptMethod } from '@/api/models/Customer'
import { SecretPost } from '@/types'
import { shortFaq } from '@/data/faq'

const FaqAccordion = dynamic(() => import('@/components/Accordion'))
const Result = dynamic(() => import('@/components/ShareSecretResult'))
const FormCreateSecret = dynamic(() => import('@/components/FormCreateSecret'))

type Request = Pick<SecretUrlFields, 'alias'> & { encryptionKey: string }
type Success = Partial<
  SecretPost & {
    progress: number
    encryptionKey: string
    readReceiptMethod: ReadReceiptMethod
  }
>
export interface State {
  data: Maybe<Partial<Success & Request>>
  error: Maybe<string>
}

export type Action =
  | { type: 'reset' }
  | { type: 'request'; data: Request }
  | { type: 'success'; data: Success }
  | { type: 'error'; error: Error }

export const doReset = (): Action => ({
  type: 'reset',
})

export const doRequest = (data: Request): Action => ({
  type: 'request',
  data,
})

export const doSuccess = (data: Success): Action => ({
  type: 'success',
  data,
})

export const doError = (error: Error): Action => ({
  type: 'error',
  error,
})

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'reset':
      return { ...state, data: undefined, error: undefined }
    case 'request':
      return { ...state, data: action.data, error: undefined }
    case 'success':
      return { ...state, data: { ...state.data, ...action.data }, error: undefined }
    case 'error':
      const { error } = action

      return {
        ...state,
        data: undefined,
        error: error.message,
      }
    default:
      throw new Error()
  }
}

const initialState: State = {
  data: undefined,
  error: undefined,
}

export const BoxShadowPaper = styled(Paper)`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 80px rgba(255, 0, 131, 0.15), 0px 0px 22px rgba(255, 0, 131, 0.15),
      0 0 1px rgba(255, 0, 131, 0.8);
    opacity: 0.1;
    border-radius: 5px;
    transition: 1000ms;
  }
`

export const HomeView: CustomPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isFocusState, setIsFocusState] = React.useState(false)

  const { ref, inView } = useInView({
    threshold: 0.9,
    delay: 300,
    initialInView: false,
  })

  const { t, i18n } = useTranslation('common')
  const { customer, isLoading } = useCustomer()

  const { data, error } = state

  const imgLinkExplanation = `/images/${i18n.language}/link-explanation.svg`

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setIsFocusState(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!inView) {
      setIsFocusState(false)
    }
  }, [inView])

  if (error) {
    return (
      <PageError error={error}>
        <BaseButton onClick={() => dispatch(doReset())} color="primary" variant="contained">
          {t('common:button.tryAgain', 'Try again')}
        </BaseButton>
      </PageError>
    )
  }

  if (data) {
    return (
      <NoSsr>
        <Page
          title={t('common:views.Home.success.title', 'Success!')}
          subtitle={t(
            'common:views.Home.success.subtitle',
            'Your secret link has been created - now share it with your confidant.',
          )}
        >
          <Result
            data={data}
            isEmojiShortLinkEnabled={customer?.isEmojiShortLinkEnabled ?? false}
            role={customer?.role || 'visitor'}
            onReset={() => {
              dispatch(doReset())
            }}
          />
        </Page>
      </NoSsr>
    )
  }

  return (
    <Page
      title={t('common:views.Home.default.title', 'Share a secret')}
      subtitle={
        <Trans i18nKey="common:views.Home.default.subtitle">
          …with a link that only works <StrokeHighlight>one time</StrokeHighlight> and then{' '}
          <Box component="span" whiteSpace="nowrap">
            self-destructs.
          </Box>
        </Trans>
      }
    >
      <Box mb={7} ref={ref}>
        <BoxShadowPaper
          elevation={1}
          id="create"
          sx={[
            isFocusState && {
              '&::before': { opacity: 1 },
            },
            {
              '&': {
                scrollMarginTop: '70px',
                position: 'relative',
                zIndex: 1,
              },
            },
          ]}
        >
          <Box px={2} position={'relative'} sx={{ transform: 'translateZ(0)' }}>
            <FormCreateSecret
              dispatch={dispatch}
              isFocusState={isFocusState}
              setFocusState={setIsFocusState}
            />
          </Box>
        </BoxShadowPaper>

        <Trust />
      </Box>

      <Section
        id="HowItWorks"
        mb={3}
        title={t('common:views.Home.HowItWorks.title', 'One-Time Secrets')}
        subtitle={t(
          'common:views.Home.HowItWorks.subtitle',
          'Share sensitive information that can only be viewed one time. The perfect way to transmit passwords, credit card information, private keys, or other confidential data.',
        )}
      >
        <HowItWorks />
      </Section>

      <Section
        id="SecretLinksExplained"
        title={t('common:views.Home.SecretLinksExplained.title', 'End-to-End Encryption')}
        subtitle={t(
          'common:views.Home.SecretLinksExplained.subtitle',
          'We encrypt your secret on your device. The encryption key is never stored but becomes part of the link itself. Without the full link, nobody, including us, will ever be able to decrypt your secret.',
        )}
      >
        <BaseButtonLink
          href="/security"
          variant="text"
          color="primary"
          startIcon={<ArrowForward />}
        >
          {t('common:views.Home.SecretLinksExplained.button', 'Learn more about security')}
        </BaseButtonLink>
        <Box mb={0}>
          <Image
            width={1030}
            height={320}
            src={imgLinkExplanation}
            alt={t('common:views.Home.SecretLinksExplained.imageAlt', 'Link explained')}
          />
        </Box>
      </Section>

      <Section
        id="SlackApp"
        title={
          <Trans i18nKey="common:views.Home.SlackApp.title">
            The Slack App
            <Typography sx={{ marginLeft: '.1em' }} component="sup" variant="h3" color="primary">
              NEW
            </Typography>
          </Trans>
        }
        subtitle={t(
          'common:views.Home.SlackApp.subtitle',
          'Some things better not stay in your chat history. Next time a coworker asks you for an access token, API key or password, you can respond in good conscience.',
        )}
      >
        <Box mb={5}>
          <BoxShadowWrapper>
            <Image
              width={800}
              height={420}
              src="/images/slack/slack-illustration.svg"
              alt="Slack"
            />
          </BoxShadowWrapper>
        </Box>
        <Box>
          <UnorderedList
            items={[
              t(
                'common:views.Home.SlackApp.usps.0',
                'Encrypted, disposable messages, stored outside of Slack.',
              ),
              t(
                'common:views.Home.SlackApp.usps.1',
                'Create one-time secrets via shortcut or slash command.',
              ),
              t(
                'common:views.Home.SlackApp.usps.2',
                'Burn notification after a secret has been viewed.',
              ),
            ]}
          />
          <Box
            display="flex"
            justifyContent="start"
            alignItems={{ sm: 'center' }}
            mt={4}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <BaseButtonLink href="/slack" variant="contained" color="primary">
              {t('common:button.learnMore', 'Learn more')}
            </BaseButtonLink>
            <Box ml={{ sm: 2 }} pt={{ xs: 1, sm: 0 }}>
              <BaseButtonLink
                href={slackAppInstallLink}
                size="large"
                variant="text"
                color="primary"
                fullWidth
              >
                {t('common:button.addToSlack', 'Add to Slack')}
              </BaseButtonLink>
            </Box>
          </Box>
        </Box>
      </Section>

      <Section
        id="FAQ"
        title={t('common:abbreviations.faq', 'FAQ')}
        subtitle={t('common:views.Home.FAQ.subtitle', 'Frequently asked questions.')}
      >
        <Box mb={3}>
          <FaqAccordion items={shortFaq(t)} />
        </Box>
        <BaseButtonLink href="/faq" variant="text" color="primary" startIcon={<ArrowForward />}>
          {t('common:button.readMoreFaq', 'Read more on FAQ page')}
        </BaseButtonLink>
      </Section>

      <Backdrop
        sx={{
          backgroundColor: 'rgba(27, 36, 46, .8)',
        }}
        open={isFocusState}
        onClick={() => setIsFocusState(false)}
      />
    </Page>
  )
}

interface WidgetProps {
  limitedToSecretType?: SecretType
}
export const Widget: CustomPage<WidgetProps> = ({ limitedToSecretType }) => {
  const { t } = useTranslation('common')
  const [state, dispatch] = useReducer(reducer, initialState)
  const { customer } = useCustomer()

  const { data, error } = state

  if (error) {
    return (
      <PageError error={error}>
        <BaseButton onClick={() => dispatch(doReset())} color="primary" variant="contained">
          {t('common:button.tryAgain', 'Try again')}
        </BaseButton>
      </PageError>
    )
  }

  if (data) {
    return (
      <Result
        data={data}
        isEmojiShortLinkEnabled={customer?.isEmojiShortLinkEnabled ?? false}
        role={customer?.role || 'visitor'}
        onReset={() => {
          dispatch(doReset())
        }}
        isStandalone={true}
      />
    )
  }

  return (
    <FormCreateSecret
      dispatch={dispatch}
      isStandalone={true}
      limitedToSecretType={limitedToSecretType}
    />
  )
}
Widget.layout = WidgetLayout

export default HomeView
