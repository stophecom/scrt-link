import React, { useState } from 'react'

import useSWR from 'swr'
import { Stripe } from 'stripe'

import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { baseUrl } from '@/constants'
import BaseButton from '@/components/BaseButton'
import BooleanSwitch from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import { fetchPostJSON } from '@/utils/fetch'

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
  const [loading, setLoading] = useState(false)
  const { data, error } = useSWR<Plan[]>(`${baseUrl}/api/plans`)

  // Form options
  const [showMonthlyPrices, setShowMonthlyPrices] = React.useState(true)

  const handleSubmit = async (priceId: string) => {
    setLoading(true)

    // Create a Checkout Session.
    const response = await fetchPostJSON(`${baseUrl}/api/checkout`, { priceId: priceId })

    if (response.statusCode === 500) {
      console.error(response.message)
      setLoading(false)
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
    console.warn(error.message)
    setLoading(false)
  }

  const classes = useStyles()

  if (error) {
    return <div>{error}</div>
  }

  if (loading) {
    return <>Loading…</>
  }

  return (
    <>
      <Grid container spacing={2} justify="center">
        {data &&
          data.map(({ name, prices }, index) => {
            const price = showMonthlyPrices ? prices.monthly : prices.yearly
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
                  >
                    Choose Plan
                  </BaseButton>
                </Paper>
              </Grid>
            )
          })}
      </Grid>
      <BooleanSwitch
        label={'Monthly Prices'}
        checked={showMonthlyPrices}
        onChange={setShowMonthlyPrices}
      />
    </>
  )
}

export default PlanSelection
