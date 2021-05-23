import React, { useEffect, useState } from 'react'
import { Stripe } from 'stripe'

import { Box, Grid, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { Check } from '@material-ui/icons'
import { useSession } from 'next-auth/client'

import { limits } from '@/constants'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { SimpleAccordion } from '@/components/Accordion'
import { PageError } from '@/components/Error'
import { Switch } from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import { api, useStripeCustomer, useCheckoutSession, usePlans, Plans } from '@/utils/fetch'
import Plan from './Plan'
import { formatCurrency, dateFromTimestamp } from '@/utils/localization'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },

    accordionHeading: {
      fontSize: '1.05rem',
      fontWeight: 'bold',
    },
    price: {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  }),
)

const premiumUsps = [
  {
    heading: `${limits.premium.maxMessageLength / 1000}k character limit`,
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Read receipts: Email & SMS ',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Emoji link 🤫',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Customize Neogram™ messages',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Personal support',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'There is more…',
    body:
      'You get early access to upcoming features. All future updated will be available for you at no extra cost.',
  },
]

const freeUsps = [
  {
    heading: `${limits.free.maxMessageLength} character limit`,
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Read receipts: Email',
    body: 'Get notification via Email when a secret has been viewed. ',
  },
  {
    heading: 'Statistics',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
]

type Status = {
  type: 'initial' | 'success' | 'error' | 'loading'
  message?: string
}

const PlanSelection: React.FunctionComponent = () => {
  const [session] = useSession()
  const { plans, isLoading, error } = usePlans()
  const { stripeCustomer } = useStripeCustomer(session?.stripeCustomerId)

  const [status, setStatus] = useState<Status>({ type: 'initial' })
  const [activePrice, setActivePrice] = useState<Stripe.Price>()
  // Form options
  const [showYearlyPrice, setShowYearlyPrices] = React.useState(false)

  // We assume a customer only ever has one subscription
  const subscription = stripeCustomer?.subscriptions?.data[0]

  const isSubscriptionBillingIntervalMonthly = activePrice?.recurring?.interval === 'month'
  const isSubscriptionBillingIntervalYearly = activePrice?.recurring?.interval === 'year'
  const isSubscriptionBillingIntervalMatch =
    (isSubscriptionBillingIntervalYearly && showYearlyPrice) ||
    (isSubscriptionBillingIntervalMonthly && !showYearlyPrice)
  const isSubscriptionActive = subscription?.status === 'active'
  const isSubscriptionActiveNotCanceled = isSubscriptionActive && !subscription?.cancel_at
  const isSubscriptionCanceled = isSubscriptionActive && !!subscription?.cancel_at

  useEffect(() => {
    setActivePrice(subscription?.items?.data[0]?.price)
    setShowYearlyPrices(subscription?.items?.data[0]?.price.recurring?.interval === 'year')
  }, [subscription])

  const deleteSubscription = (subscriptionId: string) =>
    api<Stripe.Subscription>(`/subscriptions/${subscriptionId}`, null, { method: 'DELETE' })
      .then((subscription) => {
        setStatus({
          type: 'success',
          message: `Your subscription has been canceled successfully! Your plan will automatically be downgraded to the free plan on ${dateFromTimestamp(
            subscription.cancel_at,
          )}. If you change your mind until then, feel free to reactivate any time.`,
        })
      })
      .catch((err) =>
        setStatus({
          type: 'error',
          message: err.message,
        }),
      )

  const handleSubmit = async (priceId: string) => {
    setStatus({ type: 'loading' })

    if (!plans) {
      return
    }

    try {
      // If customer has a subscription, update it.
      if (subscription?.status === 'active') {
        const response = await api<Stripe.Subscription>(
          `/subscriptions/${subscription.id}`,
          {
            priceId: priceId,
          },
          { method: 'PUT' },
        )

        setActivePrice(response?.items.data[0].price ?? {})
        setShowYearlyPrices(response?.items.data[0].price.recurring?.interval === 'year')
        setStatus({ type: 'success', message: 'You successfully changed your subscription!' })
      } else {
        // Create a Checkout Session.
        const response = await api<Stripe.Subscription>(`/checkout`, {
          priceId: priceId,
        })
        // Redirect to Checkout.
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: response.id,
        })

        if (error) {
          throw new Error(error.message as string)
        }

        setStatus({
          type: 'success',
          message: 'Misson accomplished! Your subscription is active. ',
        })
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    }
  }

  const classes = useStyles()

  type AccordionItem = { heading: string; body?: string }
  const getAccordionItems = (items: AccordionItem[]) =>
    items.map(({ heading, body }) => ({
      heading: (
        <Box display="flex" alignItems="center" textAlign="left">
          <Box display="flex" alignItems="center" pr={1}>
            <Check color="primary" />
          </Box>
          <span className={classes.accordionHeading}>{heading}</span>
        </Box>
      ),
      body: body,
    }))

  if (error) {
    return <PageError error={error} />
  }

  if (isLoading) {
    return <Spinner message="Loading plans…" />
  }

  return (
    <>
      {['error', 'success'].includes(status.type) && (
        <Box mb={2}>
          <Alert severity={status.type as 'error' | 'success'}>{status.message}</Alert>
        </Box>
      )}
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={5}>
          <Plan title="Free plan" subtitle="The basics." overline="Essentials">
            <Box display="flex" justifyContent="center">
              <Typography className={classes.price} variant="h4" component="div">
                Forever free
              </Typography>
            </Box>
            <Box mb={2}>
              <SimpleAccordion name="freeUsps" items={getAccordionItems(freeUsps)} />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" mt={'auto'}>
              {session ?? (
                <BaseButtonLink size="large" variant="contained" color="primary" href="/account">
                  Sign up
                </BaseButtonLink>
              )}
            </Box>
          </Plan>
        </Grid>
        {plans?.length &&
          plans.map(({ name, prices }, index) => {
            const price = showYearlyPrice ? prices?.yearly : prices?.monthly
            return (
              <Grid item xs={12} sm={7} key={index}>
                <Plan
                  title={name}
                  subtitle={'Includes all basic features.'}
                  overline={
                    isSubscriptionBillingIntervalMatch
                      ? 'Current Plan'
                      : price?.recurring?.interval === 'year'
                      ? 'Recommended for you'
                      : 'Stay flexible'
                  }
                  isCurrentPlan={
                    isSubscriptionActive &&
                    price.product === activePrice?.product &&
                    isSubscriptionBillingIntervalMatch
                  }
                >
                  <Box display="flex" justifyContent="center">
                    <Typography className={classes.price} variant="h4" component="div">
                      {formatCurrency(Number(price.unit_amount) / 100)}
                      <small> / {price.recurring?.interval}</small>
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <SimpleAccordion name="premiumUsps" items={getAccordionItems(premiumUsps)} />
                  </Box>

                  {subscription && isSubscriptionCanceled && (
                    <Box mb={2}>
                      <Alert severity="warning">
                        This plan has been canceled and will get downgraded to the free plan on{' '}
                        {dateFromTimestamp(subscription.cancel_at)}.
                      </Alert>
                    </Box>
                  )}

                  <Box display="flex" flexDirection="column" alignItems="center">
                    {session ? (
                      <>
                        {isSubscriptionCanceled || !subscription ? (
                          <BaseButton
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit(price.id)}
                            loading={status?.type === 'loading'}
                          >
                            {isSubscriptionCanceled ? 'Reactivate plan' : 'Choose Plan'}
                          </BaseButton>
                        ) : (
                          <>
                            {!isSubscriptionBillingIntervalMatch && (
                              <BaseButton
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  handleSubmit(
                                    activePrice?.recurring?.interval === 'year'
                                      ? prices.monthly.id
                                      : prices.yearly.id,
                                  )
                                }
                                loading={status?.type === 'loading'}
                              >
                                Switch to{' '}
                                {activePrice?.recurring?.interval === 'year' ? 'monthly' : 'yearly'}{' '}
                                billing
                              </BaseButton>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <BaseButtonLink
                        size="large"
                        variant="outlined"
                        color="primary"
                        href="/account"
                      >
                        Sign up
                      </BaseButtonLink>
                    )}
                    {subscription &&
                      isSubscriptionActiveNotCanceled &&
                      isSubscriptionBillingIntervalMatch && (
                        <BaseButton
                          variant="outlined"
                          color="primary"
                          onClick={() => deleteSubscription(subscription.id)}
                          loading={status?.type === 'loading'}
                        >
                          Cancel subscription
                        </BaseButton>
                      )}
                  </Box>
                </Plan>
              </Grid>
            )
          })}
      </Grid>

      <Box pt={5}>
        {(!subscription || (isSubscriptionBillingIntervalMonthly && !showYearlyPrice)) && (
          <Box mb={2}>
            <Typography component="div" align="center">
              Get{' '}
              <Typography variant="inherit" component="strong" color="primary">
                2 months free
              </Typography>{' '}
              with the yearly plan!
            </Typography>
          </Box>
        )}

        <Grid component="label" container alignItems="center" justify="center" spacing={1}>
          <Grid item>Monthly</Grid>
          <Grid item>
            <Switch checked={showYearlyPrice} onChange={setShowYearlyPrices} />
          </Grid>
          <Grid item>Yearly</Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PlanSelection
