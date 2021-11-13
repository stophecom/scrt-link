import React, { useReducer } from 'react'
import dynamic from 'next/dynamic'
import { Box, Paper, Typography } from '@material-ui/core'
import { ArrowForward } from '@material-ui/icons'
import Image from 'next/image'

import WidgetLayout from '@/layouts/Widget'
import { Maybe, CustomPage } from '@/types'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { PageError } from '@/components/Error'
import { SecretUrlFields } from '@/api/models/SecretUrl'
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
type Success = SecretPost & {
  encryptionKey: string
  readReceiptMethod: ReadReceiptMethod
}
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
      return { ...state, data: action.data, error: undefined }
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

const HomeView: CustomPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { data: customer, isLoading } = useCustomer()

  const { data, error } = state

  if (error) {
    return (
      <PageError error={error}>
        <BaseButton onClick={() => dispatch(doReset())} color="primary" variant="contained">
          Try again
        </BaseButton>
      </PageError>
    )
  }

  if (data) {
    return (
      <Page
        title="Success!"
        subtitle="Your secret link has been created - now share it with your confidant."
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
      title="Share a secret"
      subtitle={
        <>
          …with a link that only works <StrokeHighlight>one time</StrokeHighlight> and then{' '}
          <Box component="span" whiteSpace="nowrap">
            self-destructs.
          </Box>
        </>
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
        mb={3}
        title={'How it works'}
        subtitle={`Create end-to-end encrypted, one-time secrets with ease: Add your message and submit the form. That's it. You'll get a secret link to share with your confidant.`}
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
            Create a secret
          </BaseButtonLink>
        </Box>
      </Section>

      <Section
        title={'Secret links explained'}
        subtitle="We generate two random strings, one to identify your secret in the database and one to encrypt your message in the browser. The encryption key is never stored but becomes part of the link itself. Without the full link, nobody, including us, will ever be able to decrypt your secret."
      >
        <Box mb={0}>
          <Image width={1036} height={273} src="/images/link-explanation.svg" alt="Security" />
        </Box>
        <BaseButtonLink
          href="/security"
          variant="text"
          color="primary"
          startIcon={<ArrowForward />}
        >
          Learn more about security
        </BaseButtonLink>
      </Section>

      <Section
        title={
          <>
            The Slack App&nbsp;
            <Typography component="span" variant="h3" color="primary">
              <sup>NEW</sup>
            </Typography>
          </>
        }
        subtitle="Some things better not stay in your chat history. Next time a coworker asks you for an access token, API key or password, you can respond in good conscience."
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
              'Encrypted, disposable messages, stored outside of Slack.',
              'Create one-time secrets via shortcut or slash command.',
              'Burn notification after a secret has been viewed.',
            ]}
          />
          <Box display="flex" justifyContent="start" mt={4}>
            <BaseButtonLink href="/slack" variant="contained" color="primary">
              Learn more
            </BaseButtonLink>
            <Box ml={2}>
              <BaseButtonLink
                href={slackAppInstallLink}
                size="large"
                variant="text"
                color="primary"
              >
                Add to Slack
              </BaseButtonLink>
            </Box>
          </Box>
        </Box>
      </Section>

      <Section title={'FAQ'} subtitle="Frequently asked questions.">
        <Box mb={3}>
          <FaqAccordion items={shortFaq} />
        </Box>
        <BaseButtonLink href="/faq" variant="text" color="primary" startIcon={<ArrowForward />}>
          Read more on FAQ page
        </BaseButtonLink>
      </Section>

      {!isLoading && customer?.role !== 'premium' && (
        <Section
          title={'Support us'}
          subtitle={`For only ${formatCurrency(
            1,
          )} a month you get full access to all current and upcoming features. A free account gets you the essentials.`}
        >
          <AccountTeaser />
          <Box display="flex" justifyContent="start" mt={4}>
            <BaseButtonLink
              prefetch={false}
              href="/pricing"
              size="large"
              variant="contained"
              color="primary"
            >
              View plans
            </BaseButtonLink>
            {!customer?.role && (
              <Box ml={2}>
                <BaseButtonLink
                  href="/account?signup=true"
                  prefetch={false}
                  size="large"
                  variant="text"
                  color="primary"
                >
                  Get free account
                </BaseButtonLink>
              </Box>
            )}
          </Box>
        </Section>
      )}
    </Page>
  )
}

export const Widget: CustomPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { data: customer } = useCustomer()

  const { data, error } = state

  if (error) {
    return (
      <PageError error={error}>
        <BaseButton onClick={() => dispatch(doReset())} color="primary" variant="contained">
          Try again
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

  return <FormCreateSecret dispatch={dispatch} isStandalone={true} />
}
Widget.layout = WidgetLayout

export default HomeView
