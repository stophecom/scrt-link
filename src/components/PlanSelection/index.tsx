import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Stripe } from 'stripe'
import { useTranslation } from 'next-i18next'

import { Alert, Box, Grid, Typography, Paper } from '@mui/material'
import { Check } from '@mui/icons-material'

import usePrettyBytes from '@/hooks/usePrettyBytes'
import { formatNumber } from '@/utils/localization'
import { limits, trialPeriod } from '@/constants'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { SimpleAccordion } from '@/components/Accordion'
import { PageError } from '@/components/Error'
import { Switch } from '@/components/BooleanSwitch'
import getStripe from '@/utils/stripe'
import { abbrNum } from '@/utils/index'
import { api, useStripeCustomer, usePlans, useCustomer } from '@/utils/api'
import Plan from './Plan'
import { formatCurrency, dateFromTimestamp } from '@/utils/localization'

const Root = styled('div')`
  flex-grow: 1;
`

const Trial = styled(Typography)`
  padding-top: 0.2em;
`

const AccordionHeading = styled('span')`
  font-size: 1.05rem;
  font-weight: bold;
`

const PriceInner = styled('div')(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  borderBottom: `4px solid ${theme.palette.primary.main}`,
}))

const Price: React.FunctionComponent = ({ children }) => (
  <Typography variant="h2" mb={2}>
    <PriceInner>{children}</PriceInner>
  </Typography>
)

type Status = {
  type: 'initial' | 'success' | 'error' | 'loading'
  message?: string
}

const PlanSelection: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const prettyBytes = usePrettyBytes()
  const { data: customer } = useCustomer()
  const { plans, isLoading, error } = usePlans()
  const { stripeCustomer, triggerFetchStripeCustomer } = useStripeCustomer(
    customer?.stripe?.customerId,
  )

  const [status, setStatus] = useState<Status>({ type: 'initial' })
  const [activePrice, setActivePrice] = useState<Stripe.Price>()
  // Form options
  const [showYearlyPrice, setShowYearlyPrices] = React.useState(true)

  // We assume a customer only ever has one subscription
  const subscription = stripeCustomer?.subscriptions?.data[0]

  const isSubscriptionBillingIntervalMonthly = activePrice?.recurring?.interval === 'month'
  const isSubscriptionBillingIntervalYearly = activePrice?.recurring?.interval === 'year'
  const isSubscriptionBillingIntervalMatch =
    (isSubscriptionBillingIntervalYearly && showYearlyPrice) ||
    (isSubscriptionBillingIntervalMonthly && !showYearlyPrice)
  const isSubscriptionTrialing = subscription?.status === 'trialing'
  const isSubscriptionActive = subscription?.status === 'active' || isSubscriptionTrialing
  const isSubscriptionActiveNotCanceled = isSubscriptionActive && !subscription?.cancel_at
  const isSubscriptionCanceled = isSubscriptionActive && !!subscription?.cancel_at

  // Get % yearly savings. We take first plan. (There should be only one)
  const premiumPlanPrices = plans?.length && plans[0].prices
  const yearlyPlanSavings =
    premiumPlanPrices &&
    premiumPlanPrices.yearly.unit_amount &&
    premiumPlanPrices.monthly.unit_amount &&
    Math.floor(
      (1 - premiumPlanPrices.yearly.unit_amount / 12 / premiumPlanPrices.monthly.unit_amount) * 100,
    )

  const premiumUsps = [
    {
      heading: t(
        'common:components.PlanSelection.plans.premium.usps.0.heading',
        `Everything in Free, plus:`,
      ),
    },
    {
      heading: t('common:components.PlanSelection.plans.premium.usps.1.heading', {
        defaultValue: `{{characterLimit}} character limit`,
        characterLimit: abbrNum(limits.premium.maxMessageLength, 1),
      }),
      body: t('common:components.PlanSelection.plans.premium.usps.1.body', {
        defaultValue: `You can write secret messages with up to {{characterLimit}} characters. Enough words for the perfect secret love letter, confession or disclosure.`,
        characterLimit: formatNumber(limits.premium.maxMessageLength),
      }),
    },
    {
      heading: t('common:components.PlanSelection.plans.premium.usps.files.heading', {
        defaultValue: `{{uploadLimit}} files`,
        uploadLimit: prettyBytes(limits.premium.maxFileSize),
      }),
      body: t('common:components.PlanSelection.plans.premium.usps.files.body', {
        defaultValue: `You can send files with up to {{uploadLimit}}.`,
        uploadLimit: prettyBytes(limits.premium.maxFileSize),
      }),
    },
    {
      heading: t(
        'common:components.PlanSelection.plans.premium.usps.2.heading',
        'Read receipts: Email & SMS',
      ),
      body: t(
        'common:components.PlanSelection.plans.premium.usps.2.body',
        'Fast, convenient. Get read notifications via SMS.',
      ),
    },
    {
      heading: t(
        'common:components.PlanSelection.plans.premium.usps.3.heading',
        'Customize Neogram messages',
      ),
      body: t(
        'common:components.PlanSelection.plans.premium.usps.3.body',
        'Add a special touch to your secrets.',
      ),
    },
    {
      heading: t(
        'common:components.PlanSelection.plans.premium.usps.4.heading',
        'Priority support',
      ),
      body: t(
        'common:components.PlanSelection.plans.premium.usps.4.body',
        `You'll be first in line if you need help.`,
      ),
    },
    {
      heading: t('common:components.PlanSelection.plans.premium.usps.5.heading', 'More to come…'),
      body: t(
        'common:components.PlanSelection.plans.premium.usps.5.body',
        `You'll get all future updates at no extra cost. Plus, early access to upcoming features.`,
      ),
    },
  ]

  const freeUsps = [
    {
      heading: t(
        'common:components.PlanSelection.plans.free.usps.secretTypes.heading',
        'All secret types',
      ),
      body: t(
        'common:components.PlanSelection.plans.free.usps.secretTypes.body',
        'With an account you get access to all secret types.',
      ),
    },
    {
      heading: t('common:components.PlanSelection.plans.free.usps.0.heading', {
        defaultValue: `{{characterLimit}} character limit`,
        characterLimit: abbrNum(limits.free.maxMessageLength, 1),
      }),
      body: t('common:components.PlanSelection.plans.free.usps.0.body', {
        defaultValue: `You can write secret messages with up to {{characterLimit}} characters.`,
        characterLimit: formatNumber(limits.free.maxMessageLength),
      }),
    },
    {
      heading: t('common:components.PlanSelection.plans.free.usps.files.heading', {
        defaultValue: `{{uploadLimit}} files`,
        uploadLimit: prettyBytes(limits.free.maxFileSize),
      }),
      body: t('common:components.PlanSelection.plans.free.usps.files.body', {
        defaultValue: `You can send files with up to {{uploadLimit}}.`,
        uploadLimit: prettyBytes(limits.free.maxFileSize),
      }),
    },
    {
      heading: t(
        'common:components.PlanSelection.plans.free.usps.1.heading',
        'Read receipts: Email',
      ),
      body: t(
        'common:components.PlanSelection.plans.free.usps.1.body',
        'Get notification via Email whenever a secret has been viewed.',
      ),
    },
    {
      heading: t(
        'common:components.PlanSelection.plans.free.usps.2.heading',
        'Email delivery service',
      ),
      body: t(
        'common:components.PlanSelection.plans.free.usps.2.body',
        'No more app switching: Send secret links directly from our platform.',
      ),
    },
  ]

  useEffect(() => {
    if (subscription) {
      setActivePrice(subscription?.items?.data[0]?.price)
      setShowYearlyPrices(subscription?.items?.data[0]?.price.recurring?.interval === 'year')
    }
  }, [subscription])

  const deleteSubscription = (subscriptionId: string) =>
    api<Stripe.Subscription>(`/subscriptions/${subscriptionId}`, { method: 'DELETE' })
      .then((subscription) => {
        setStatus({
          type: 'success',
          message: t('common:components.PlanSelection.subscriptionCancellationSuccessMessage', {
            defaultValue: `Your subscription has been canceled successfully! Your plan will automatically be downgraded to the free plan on {{cancellationDate}}. If you change your mind until then, feel free to reactivate any time.`,
            cancellationDate: dateFromTimestamp(subscription.cancel_at),
          }),
        })
        triggerFetchStripeCustomer()
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
          { method: 'PUT' },
          {
            priceId: priceId,
          },
        )

        setActivePrice(response?.items.data[0].price ?? {})
        setShowYearlyPrices(response?.items.data[0].price.recurring?.interval === 'year')
        setStatus({
          type: 'success',
          message: t(
            'common:components.PlanSelection.subscriptionChangeSuccessMessage',
            'You successfully changed your subscription!',
          ),
        })
      } else {
        // Create a Checkout Session.
        const response = await api<Stripe.Subscription>(
          `/checkout`,
          { method: 'POST' },
          {
            priceId: priceId,
          },
        )
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
          message: t(
            'common:components.PlanSelection.subscriptionActiveSuccessMessage',
            'Mission accomplished! Your subscription is active.',
          ),
        })
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : t('common:error.unexpectedError', 'Unexpected error'),
      })
    } finally {
      triggerFetchStripeCustomer()
    }
  }

  type AccordionItem = { heading: string; body?: string }
  const getAccordionItems = (items: AccordionItem[]) =>
    items.map(({ heading, body }) => ({
      heading: (
        <Box display="flex" alignItems="center" textAlign="left">
          <Box display="flex" alignItems="center" pr={1}>
            <Check color="primary" />
          </Box>
          <AccordionHeading>{heading}</AccordionHeading>
        </Box>
      ),
      body,
    }))

  if (error) {
    return <PageError error={error} />
  }

  if (isLoading) {
    return <Spinner message={t('common:components.PlanSelection.loading', 'Loading plans')} />
  }

  return (
    <Root>
      {['error', 'success'].includes(status.type) && (
        <Box mb={2}>
          <Alert severity={status.type as 'error' | 'success'}>{status.message}</Alert>
        </Box>
      )}

      <Box display="flex" justifyContent="center" pb={4}>
        <Grid component="label" container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>{t('common:components.PlanSelection.interval.monthly', 'Monthly')}</Grid>
          <Grid item>
            <Switch checked={showYearlyPrice} onChange={setShowYearlyPrices} />
          </Grid>
          <Grid item>
            {t('common:components.PlanSelection.interval.yearly', 'Annual')} (
            {t('common:components.PlanSelection.interval.yearlySavings', {
              defaultValue: 'Save {{percentage}}%',
              percentage: yearlyPlanSavings,
            })}
            )
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={5} order={{ xs: 2, sm: 1 }}>
          <Plan
            title={t('common:plans.free.title', 'Free')}
            subtitle={t('common:components.PlanSelection.free.subtitle', 'No strings attached.')}
            isCurrentPlan={!!customer?.userId && !isSubscriptionActive}
          >
            <Box
              display="flex"
              flexDirection={'column'}
              justifyContent="center"
              alignItems={'center'}
              mb={7}
            >
              <Price>{formatCurrency(0, 0)}</Price>
              <Box display="flex" flexDirection={'column'}>
                <span>{t('common:components.PlanSelection.free.price', 'Free forever')}</span>
              </Box>
            </Box>
            <Box mb={2}>
              <SimpleAccordion name="freeUsps" items={getAccordionItems(freeUsps)} />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" mt={'auto'}>
              {!customer?.userId && (
                <BaseButtonLink size="large" variant="contained" color="primary" href="/signup">
                  {t('common:button.signUpFree', 'Sign up free')}
                </BaseButtonLink>
              )}
            </Box>
          </Plan>
        </Grid>
        {plans?.length &&
          plans.map(({ name, prices }, index) => {
            const price = showYearlyPrice ? prices?.yearly : prices?.monthly
            return (
              <Grid item xs={12} sm={7} key={index} order={{ sm: 2, xs: 1 }}>
                <Plan
                  title={name}
                  subtitle={
                    <>
                      {t('common:components.PlanSelection.premium.subtitle', 'Basically a steal.')}
                    </>
                  }
                  isCurrentPlan={
                    isSubscriptionActive &&
                    price.product === activePrice?.product &&
                    isSubscriptionBillingIntervalMatch
                  }
                >
                  <Box
                    display="flex"
                    flexDirection={'column'}
                    justifyContent="center"
                    alignItems={'center'}
                    mb={4}
                  >
                    <Price>
                      {formatCurrency(Number(price.unit_amount) / 100 / (showYearlyPrice ? 12 : 1))}
                    </Price>

                    <Box display="flex" flexDirection={'column'}>
                      <span>{t('common:perMonth', 'per month')}</span>
                      {price.recurring?.interval === 'year' ? (
                        <>
                          <span>
                            {t('common:components.PlanSelection.amountBilledPerYear', {
                              defaultValue: 'billed {{amount}} annually',
                              amount: formatCurrency(Number(price.unit_amount) / 100),
                            })}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {t('common:components.PlanSelection.amountBilledPerMonth', {
                              defaultValue: 'billed {{amount}} a month',
                              amount: formatCurrency(Number(price.unit_amount) / 100),
                            })}
                          </span>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <SimpleAccordion name="premiumUsps" items={getAccordionItems(premiumUsps)} />
                  </Box>

                  {subscription && (
                    <Box mb={2}>
                      <Alert
                        severity={isSubscriptionCanceled ? 'warning' : 'success'}
                        icon={isSubscriptionActive && false}
                      >
                        {isSubscriptionCanceled ? (
                          <>
                            {t('common:components.PlanSelection.cancellationNotice', {
                              defaultValue:
                                'This plan has been canceled and will get downgraded to the free plan on {{cancellationDate}}.',
                              cancellationDate: dateFromTimestamp(subscription.cancel_at),
                            })}
                          </>
                        ) : (
                          <>
                            {t(
                              'common:components.PlanSelection.activePlan',
                              'This plan is currently active.',
                            )}
                            &nbsp;
                            {isSubscriptionTrialing
                              ? t('common:components.PlanSelection.trialEndNotice', {
                                  defaultValue: `Trial ends on {{trialEndDate}}.`,
                                  trialEndDate: dateFromTimestamp(subscription?.trial_end),
                                })
                              : t('common:components.PlanSelection.recurringPriceInfo', {
                                  defaultValue: `You are being billed {{price}} every {{interval}}.`,
                                  price: formatCurrency(Number(activePrice?.unit_amount) / 100),
                                  interval: activePrice?.recurring?.interval,
                                })}
                            &nbsp;
                            {t(
                              'common:components.PlanSelection.planSwitchOrCancelNotice',
                              'You can switch billing cycle or cancel the subscription anytime.',
                            )}
                          </>
                        )}
                      </Alert>
                    </Box>
                  )}

                  <Box display="flex" flexDirection="column" alignItems="center">
                    {customer?.userId ? (
                      <>
                        {isSubscriptionCanceled || !subscription ? (
                          <>
                            <BaseButton
                              size="large"
                              variant="contained"
                              color="primary"
                              onClick={() => handleSubmit(price.id)}
                              loading={status?.type === 'loading'}
                            >
                              {isSubscriptionCanceled
                                ? t('common:button.reactivatePlan', 'Reactivate plan')
                                : t('common:button.tryFree', 'Try it free')}
                            </BaseButton>
                            {!subscription && (
                              <Trial variant="body2">
                                {t('common:components.PlanSelection.freeTrialInfo', {
                                  defaultValue: '{{trialPeriod}} days free trial',
                                  trialPeriod,
                                })}
                              </Trial>
                            )}
                          </>
                        ) : (
                          <>
                            {!isSubscriptionBillingIntervalMatch && (
                              <BaseButton
                                variant="contained"
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
                                {activePrice?.recurring?.interval === 'year'
                                  ? t(
                                      'common:components.PlanSelection.switchToMonthlyBilling',
                                      'Switch to monthly billing',
                                    )
                                  : t(
                                      'common:components.PlanSelection.switchToYearlyBilling',
                                      'Switch to annual billing',
                                    )}
                              </BaseButton>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <BaseButtonLink
                        disabled
                        size="large"
                        variant="outlined"
                        color="primary"
                        href="/account"
                      >
                        {t('common:button.signUpFirst', 'Sign up first')}
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
                          {t('common:button.cancelSubscription', 'Cancel subscription')}
                        </BaseButton>
                      )}
                  </Box>
                </Plan>
              </Grid>
            )
          })}
      </Grid>
    </Root>
  )
}

export default PlanSelection
