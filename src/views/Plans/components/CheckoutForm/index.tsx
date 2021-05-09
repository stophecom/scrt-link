import React, { useState } from 'react'

import { Grid, Paper, Typography } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { baseUrl } from '@/constants'
import BaseButton from '@/components/BaseButton'
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

const plans = [
  {
    name: 'Free',
    priceId: '',
  },
  {
    name: 'Secret',
    priceId: 'price_1IpJ6CBo4UBHEOfAKiOu38aq',
  },
  {
    name: 'Top secret',
    priceId: 'price_1IpIhiBo4UBHEOfAmd6fFHyQ',
  },
]

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false)

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

  if (loading) {
    return <>Loading…</>
  }

  return (
    <Grid container spacing={2} justify="center">
      {plans.map(({ name, priceId }, index) => {
        return (
          <Grid item xs={12} sm={4} key={index}>
            <Paper className={classes.paper}>
              <div>
                <Typography variant="h3">{name}</Typography>
                <Typography variant="body1">{priceId}</Typography>
              </div>
              <BaseButton variant="contained" color="primary" onClick={() => handleSubmit(priceId)}>
                Choose Plan
              </BaseButton>
            </Paper>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default CheckoutForm
