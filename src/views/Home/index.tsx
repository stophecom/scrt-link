import React, { useReducer } from 'react'
import dynamic from 'next/dynamic'
import { Box, Paper, Typography } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import Image from 'next/image'
import { useTranslation, Trans } from 'next-i18next'

import WidgetLayout from '@/layouts/Widget'
import { Maybe, CustomPage } from '@/types'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { PageError } from '@/components/Error'
import { SecretUrlFields, SecretType } from '@/api/models/SecretUrl'
import { formatCurrency } from '@/utils/localization'
import Page from '@/components/Page'
import Section from '@/components/Section'
import BoxShadowWrapper from '@/components/BoxShadowWrapper'
import UnorderedList from '@/components/UnorderedList'
import StrokeHighlight from './components/StrokeHighlight'
import HowItWorks from './components/HowItWorks'
import AccountTeaser from './components/AccountTeaser'
import Trust from './components/Trust'
import { slackAppInstallLink } from '@/constants'
import { useCustomer } from '@/utils/api'
import { scrollIntoView } from '@/utils/browser'
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

export const HomeView: CustomPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { t, i18n } = useTranslation('common')

  const { data: customer, isLoading } = useCustomer()

  const { data, error } = state

  const imgLinkExplanation = `/images/link-explanation-${i18n.language}.svg`

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
      <Box mb={7}>
        <Paper elevation={1} id="create" style={{ scrollMarginTop: '70px' }}>
          <Box px={2}>
            <FormCreateSecret dispatch={dispatch} />
          </Box>
        </Paper>
        <Trust />
      </Box>

      <Section
        id="HowItWorks"
        mb={3}
        title={t('common:views.Home.HowItWorks.title', 'How it works')}
        subtitle={t(
          'common:views.Home.HowItWorks.subtitle',
          `Create end-to-end encrypted, one-time secrets with ease: Add your message and submit the form. That's it. You'll get a secret link to share with your confidant.`,
        )}
      >
        <HowItWorks />
        <Box display="flex" justifyContent="center" pt={5}>
          <BaseButtonLink
            href="#create"
            size="large"
            variant="contained"
            color="primary"
            onClick={scrollIntoView}
          >
            {t('common:button.createSecret', 'Create a secret')}
          </BaseButtonLink>
        </Box>
      </Section>

      <Section
        id="SecretLinksExplained"
        title={t('common:views.Home.SecretLinksExplained.title', 'Secret links explained')}
        subtitle={t(
          'common:views.Home.SecretLinksExplained.subtitle',
          'We generate two random strings, one to identify your secret in the database and one to encrypt your message in the browser. The encryption key is never stored but becomes part of the link itself. Without the full link, nobody, including us, will ever be able to decrypt your secret.',
        )}
      >
        <Box mb={0}>
          <Image
            width={1030}
            height={320}
            src={imgLinkExplanation}
            alt={t('common:views.Home.SecretLinksExplained.imageAlt', 'Link explained')}
          />
        </Box>
        <BaseButtonLink
          href="/security"
          variant="text"
          color="primary"
          startIcon={<ArrowForward />}
        >
          {t('common:views.Home.SecretLinksExplained.button', 'Learn more about security')}
        </BaseButtonLink>
      </Section>

      <Section
        id="SlackApp"
        title={
          <Trans i18nKey="common:views.Home.SlackApp.title">
            The Slack App&nbsp;
            <Typography component="span" variant="h3" color="primary">
              <sup>NEW</sup>
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

      {!isLoading && customer?.role !== 'premium' && (
        <Section
          id="Upsell"
          title={t('common:views.Home.Upsell.title', 'Support us')}
          subtitle={t('common:views.Home.Upsell.subtitle', {
            defaultValue: `For only {{price}} a month you get full access to all current and upcoming features. A free account gets you the essentials.`,
            price: formatCurrency(1),
          })}
        >
          <AccountTeaser />
          <Box
            display="flex"
            justifyContent="start"
            alignItems={{ sm: 'center' }}
            mt={4}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <BaseButtonLink
              prefetch={false}
              href="/pricing"
              size="large"
              variant="contained"
              color="primary"
            >
              {t('common:button.viewPlans', 'View plans')}
            </BaseButtonLink>
            {!customer?.role && (
              <Box ml={{ sm: 2 }} pt={{ xs: 1, sm: 0 }}>
                <BaseButtonLink
                  fullWidth
                  href="/signup"
                  prefetch={false}
                  size="large"
                  variant="text"
                  color="primary"
                >
                  {t('common:button.getFreeAccount', 'Get free account')}
                </BaseButtonLink>
              </Box>
            )}
          </Box>
        </Section>
      )}
    </Page>
  )
}

interface WidgetProps {
  limitedToSecretType?: SecretType
}
export const Widget: CustomPage<WidgetProps> = ({ limitedToSecretType }) => {
  const { t } = useTranslation('common')
  const [state, dispatch] = useReducer(reducer, initialState)
  const { data: customer } = useCustomer()

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
