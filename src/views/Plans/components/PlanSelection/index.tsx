import React, { useState } from 'react'
import useSWR from 'swr'
import { Stripe } from 'stripe'
import { Box, Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { baseUrl } from '@/constants'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { PageError, Error } from '@/components/Error'
import { Switch } from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import { fetchPostJSON } from '@/utils/fetch'

function usePlans() {
  const { data, error } = useSWR<Plan[]>(`${baseUrl}/api/plans`)

  return {
    plans: data,
    isLoading: !error && !data,
    error: error,
  }
}

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

type Plan = {
  name: string
  prices: { monthly: Stripe.Price; yearly: Stripe.Price }
}
const PlanSelection: React.FunctionComponent = () => {
  const { plans, isLoading, error } = usePlans()

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState('')
  // Form options
  const [showMonthlyPrices, setShowMonthlyPrices] = React.useState(true)

  const handleSubmit = async (priceId: string) => {
    setIsPaymentProcessing(true)

    // Create a Checkout Session.
    const response = await fetchPostJSON(`${baseUrl}/api/checkout`, { priceId: priceId })
    if (response.statusCode === 500) {
      setCheckoutErrorMessage(response.message)
      setIsPaymentProcessing(false)
      return
    }

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    })

    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    setCheckoutErrorMessage(error?.message || '')
    setIsPaymentProcessing(false)
  }

  const classes = useStyles()

  if (error) {
    return <PageError error={error} />
  }

  if (isLoading) {
    return <Spinner message="Loading plans" />
  }

  return (
    <>
      <Grid container spacing={2} justify="center">
        {checkoutErrorMessage && <Error error={checkoutErrorMessage} />}
        {plans &&
          plans.map(({ name, prices }, index) => {
            const price = showMonthlyPrices ? prices?.monthly : prices?.yearly
            return (
              <Grid item xs={12} sm={4} key={index}>
                <Paper className={classes.paper}>
                  <div>
                    <Typography variant="h3">{name}</Typography>
                    <Typography variant="body1">{price.unit_amount}</Typography>
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
