import React, { useEffect, useState } from 'react'
import { Stripe } from 'stripe'

import { Box, Grid, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Alert from '@material-ui/lab/Alert'
import { Check } from '@material-ui/icons'
import { useSession } from 'next-auth/client'

import { BaseButtonLink } from '@/components/Link'
import { baseUrl } from '@/constants'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { SimpleAccordion } from '@/components/Accordion'
import { PageError } from '@/components/Error'
import { Switch } from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import {
  api,
  useSubscription,
  useStripeCustomer,
  useCheckoutSession,
  usePlans,
  Plans,
} from '@/utils/fetch'
import Plan from './Plan'
import { formatCurrency } from '@/utils/localization'

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

const usps = [
  {
    heading: 'Read receipts',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: '10k character limit',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Emoji link 🤫',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
  },
  {
    heading: 'Unlimited Neogram™ messages',
    body: 'Get notification via SMS or Email when a secret has been viewed. ',
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
const getPlanById = (plans: Plans, id: string) => plans.find((element) => element.id === id)

const PlanSelection: React.FunctionComponent = () => {
  const router = useRouter()
  const [session] = useSession()
  const { plans, isLoading, error } = usePlans()
  const { subscription } = useSubscription()
  const { stripeCustomer } = useStripeCustomer()
  const { checkoutSession } = useCheckoutSession(router.query.session_id as string)

  const [status, setStatus] = useState<Status>({ type: 'initial' })
  const [activePrice, setActivePrice] = useState<Stripe.Price>()

  // Form options
  const [showYearlyPrice, setShowYearlyPrices] = React.useState(false)

  useEffect(() => {
    setActivePrice(subscription?.items.data[0].price)
  }, [subscription])

  const deleteSubscription = (subscriptionId: string) =>
    api<Stripe.Subscription>(`/subscriptions/${subscriptionId}`, null, { method: 'DELETE' })
      .then(() =>
        setStatus({
          type: 'success',
          message: 'Your subscription has been cancelled successfully!',
        }),
      )
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

  const items = usps.map(({ heading, body }, index) => ({
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
        <Alert severity={status.type as 'error' | 'success'}>{status.message}</Alert>
      )}
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={5}>
          <Plan title="Free plan" subtitle="Basic features." overline="Downgrade">
            <Typography variant="h4" component="div">
              Free
            </Typography>
          </Plan>
        </Grid>
        {plans?.length &&
          plans.map(({ name, prices }, index) => {
            const price = showYearlyPrice ? prices?.yearly : prices?.monthly
            return (
              <Grid item xs={12} sm={7} key={index}>
                <Plan
                  title={name}
                  subtitle={'For professional spies…'}
                  isCurrentPlan={
                    subscription?.status === 'active' && price.product === activePrice?.product
                  }
                >
                  <Box display="flex" justifyContent="center">
                    <Typography className={classes.price} variant="h4" component="div">
                      {formatCurrency(Number(price.unit_amount) / 100)}
                      <small> / {price.recurring?.interval}</small>
                    </Typography>
                  </Box>
                  <Box mb={2}>
                    <SimpleAccordion name="usps" items={items} />
                  </Box>

                  {session ? (
                    <BaseButton
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit(price.id)}
                      loading={status?.type === 'loading'}
                    >
                      Choose Plan
                    </BaseButton>
                  ) : (
                    <BaseButtonLink
                      size="large"
                      variant="contained"
                      color="primary"
                      href="/account"
                    >
                      Sign up
                    </BaseButtonLink>
                  )}
                  {subscription?.status === 'active' && (
                    <BaseButton
                      variant="text"
                      color="primary"
                      onClick={() => deleteSubscription(subscription.id)}
                      loading={status?.type === 'loading'}
                    >
                      Cancel subscription
                    </BaseButton>
                  )}
                </Plan>
              </Grid>
            )
          })}
      </Grid>

      <Box pt={5}>
        <Box mb={2}>
          <Typography component="div" align="center">
            Get{' '}
            <Typography variant="inherit" component="strong" color="primary">
              2 months free
            </Typography>{' '}
            with the yearly plan!
          </Typography>
        </Box>
        <Grid component="label" container alignItems="center" justify="center" spacing={1}>
          <Grid item>Monthly</Grid>
          <Grid item>
            <Switch checked={showYearlyPrice} onChange={setShowYearlyPrices} />
          </Grid>
          <Grid item>Yearly</Grid>
        </Grid>
      </Box>
      <Alert severity="success">
        plans = {JSON.stringify(plans, null, 3)}
        <br />
        CheckoutSession: <pre>{JSON.stringify(checkoutSession, null, 2)}</pre>
        Subscription: <pre>{JSON.stringify(subscription, null, 2)}</pre>
        {/* stripeCustomer: <pre>{JSON.stringify(stripeCustomer, null, 2)}</pre> */}
        active price: <pre>{JSON.stringify(activePrice, null, 2)}</pre>
      </Alert>
    </>
  )
}

export default PlanSelection
