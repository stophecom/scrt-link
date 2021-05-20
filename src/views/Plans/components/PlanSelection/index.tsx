import React, { useEffect, useState } from 'react'
import { Stripe } from 'stripe'

import { Box, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import Alert from '@material-ui/lab/Alert'
import CustomError from '@/utils/error'

import { baseUrl } from '@/constants'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { PageError, Error } from '@/components/Error'
import { Switch } from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import {
  fetchJSON,
  useSubscription,
  useStripeCustomer,
  useCheckoutSession,
  usePlans,
} from '@/utils/fetch'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      height: '100%',

      [theme.breakpoints.up('sm')]: {
        flexDirection: 'column',
        textAlign: 'center',
      },
    },
  }),
)

const PlanSelection: React.FunctionComponent = () => {
  const router = useRouter()

  const { plans, isLoading, error } = usePlans()
  const { subscription } = useSubscription()
  const { stripeCustomer } = useStripeCustomer()
  const { checkoutSession } = useCheckoutSession(router.query.session_id as string)

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState('')
  const [activePrice, setActivePrice] = useState<Stripe.Price>()

  // Form options
  const [showMonthlyPrices, setShowMonthlyPrices] = React.useState(true)

  useEffect(() => {
    setActivePrice(subscription?.items.data[0].price)
  }, [subscription])

  // const activeProduct = path(['items', 'data', 0, 'price'])(subscription)

  const handleSubmit = async (priceId: string) => {
    setIsPaymentProcessing(true)

    try {
      // If customer has a subscription, update it.
      if (subscription?.id) {
        const response = await fetchJSON(
          `${baseUrl}/api/subscriptions/${subscription.id}`,
          {
            priceId: priceId,
          },
          { method: 'PUT' },
        )

        setActivePrice(response?.items.data[0].price ?? {})

        if (response.statusCode === 500) {
          throw new CustomError(response.message)
        }
      } else {
        // Create a Checkout Session.
        const response = await fetchJSON(`${baseUrl}/api/checkout`, { priceId: priceId })
        if (response.statusCode === 500) {
          throw response.message
        }

        // Redirect to Checkout.
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: response.id,
        })
        if (error) {
          throw new CustomError(error.message as string)
        }
      }
    } catch (err) {
      setCheckoutErrorMessage(err.message)
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  const classes = useStyles()

  if (error) {
    return <PageError error={error} />
  }

  if (isLoading) {
    return <Spinner message="Loading plans…" />
  }

  return (
    <>
      <Alert severity="success">
        Active Price = {JSON.stringify(activePrice?.id, null, 2)}
        <br />
        CheckoutSession: <pre>{JSON.stringify(checkoutSession, null, 2)}</pre>
        Subscription: <pre>{JSON.stringify(subscription, null, 2)}</pre>
        stripeCustomer: <pre>{JSON.stringify(stripeCustomer, null, 2)}</pre>
      </Alert>
      {checkoutErrorMessage && <Error error={checkoutErrorMessage} />}
      <Grid container spacing={2} justify="center">
        {plans?.length &&
          plans.map(({ name, prices }, index) => {
            const price = showMonthlyPrices ? prices?.monthly : prices?.yearly
            return (
              <Grid item xs={12} sm={4} key={index}>
                <Paper className={classes.paper}>
                  <div>
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="body1">{price.unit_amount}</Typography>
                    <small>{price.product === activePrice?.product && 'Current Plan'}</small>
                  </div>
                  <BaseButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit(price.id)}
                    loading={isPaymentProcessing}
                  >
                    Choose Plan
                  </BaseButton>
                </Paper>
              </Grid>
            )
          })}
      </Grid>
      <Box pt={5}>
        <Box mb={2}>
          <Typography align="center">Save up to 15% with yearly price!</Typography>
        </Box>
        <Grid component="label" container alignItems="center" justify="center" spacing={1}>
          <Grid item>Monthly</Grid>
          <Grid item>
            <Switch checked={showMonthlyPrices} onChange={setShowMonthlyPrices} />
          </Grid>
          <Grid item>Yearly</Grid>
        </Grid>
      </Box>
    </>
  )
}

export default PlanSelection
