import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { Stripe } from 'stripe'
import { useTranslation } from 'next-i18next'

import {
  Alert,
  Box,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { Check } from '@mui/icons-material'

import usePrettyBytes from '@/hooks/usePrettyBytes'
import { formatNumber } from '@/utils/localization'
import { limits, premiumPlanName, enterprisePlanName, freePlanName } from '@/constants'
import { BaseButtonLink } from '@/components/Link'
import BaseButton from '@/components/BaseButton'
import { Spinner } from '@/components/Spinner'
import { SimpleAccordion } from '@/components/Accordion'
import { PageError } from '@/components/Error'

import Switch from '@/components/Switch'
import getStripe from '@/utils/stripe'
import { abbrNum } from '@/utils/index'
import { api, useStripeCustomer, usePlans, useCustomer } from '@/utils/api'
import Plan from './Plan'
import { formatCurrency, dateFromTimestamp } from '@/utils/localization'

const Root = styled('div')`
  flex-grow: 1;
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
  <Typography variant="h2" mb={2} component={'div'}>
    <PriceInner>{children}</PriceInner>
  </Typography>
)

type Status = {
  type: 'initial' | 'success' | 'error' | 'loading'
  message?: string
}

type Currency = 'USD' | 'EUR' | 'CHF'
const supportedCurrencies = ['USD', 'EUR', 'CHF']

const PlanSelection: React.FunctionComponent = () => {
  const { t } = useTranslation()
  const prettyBytes = usePrettyBytes()

  // Form options
  const [showYearlyPrice, setShowYearlyPrices] = React.useState(true)
  const [currency, setCurrency] = React.useState<Currency>('USD')

  const { customer } = useCustomer()
  const { plans, isLoading, error } = usePlans(currency)
  const { stripeCustomer, triggerFetchStripeCustomer } = useStripeCustomer(
    customer?.stripe?.customerId,
  )

  const [status, setStatus] = useState<Status>({ type: 'initial' })
  const [activePrice, setActivePrice] = useState<Stripe.Price>()

  // We assume a customer only ever has one subscription
  const subscription = stripeCustomer?.subscriptions?.data[0]

  const isSubscriptionBillingIntervalMonthly = activePrice?.recurring?.interval === 'month'
  const isSubscriptionBillingIntervalYearly = activePrice?.recurring?.interval === 'year'
  const isSubscriptionBillingIntervalMatch =
    (isSubscriptionBillingIntervalYearly && showYearlyPrice) ||
    (isSubscriptionBillingIntervalMonthly && !showYearlyPrice)
  const isSubscriptionTrialing = subscription?.status === 'trialing'
  const isSubscriptionActive = subscription?.status === 'active' || isSubscriptionTrialing
  const isSubscriptionCanceled = isSubscriptionActive && !!subscription?.cancel_at

  // Get % yearly savings. We take first plan. (There should be only one)
  const premiumPlanPrices = plans?.length && plans[0].prices
  const yearlyPlanSavings =
    premiumPlanPrices &&
    premiumPlanPrices?.yearly?.unit_amount &&
    premiumPlanPrices?.monthly?.unit_amount &&
    Math.floor(
      (1 - premiumPlanPrices.yearly.unit_amount / 12 / premiumPlanPrices.monthly.unit_amount) * 100,
    )

  // Sort plans enterprise comes after premium
  plans?.sort((a, b) => {
    if (a.name === premiumPlanName) {
      return -1
    } else {
      return 1
    }
  })

  const enterpriseUsps = [
    {
      heading: t('common:components.PlanSelection.plans.previousPlanBenefits', {
        defaultValue: `Everything in {{plan}}`,
        plan: premiumPlanName,
      }),
    },
    {
      heading: t('common:components.PlanSelection.plans.enterprise.usps.support.heading', {
        defaultValue: 'You become part of the {{enterprisePlanName}} society.',
        enterprisePlanName,
      }),
      body: t('common:components.PlanSelection.plans.enterprise.usps.support.body', {
        defaultValue: `Join a circle of like-minded people that make the web a better place. With your contribution you help us become sustainable.`,
      }),
    },
  ]

  const premiumUsps = [
    {
      heading: t('common:components.PlanSelection.plans.previousPlanBenefits', {
        defaultValue: `Everything in {{plan}}`,
        plan: freePlanName,
      }),
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

  const CurrencySelection = () => {
    const handleCurrencyChange = (event: SelectChangeEvent) => {
      setCurrency(event.target.value as Currency)
    }

    return (
      <Box py={3} sx={{ minWidth: 150 }}>
        <FormControl fullWidth>
          <InputLabel id="currency-select-label">{t('common:currency', 'Currency')}</InputLabel>
          <Select
            labelId="currency-select-label"
            id="currency-select-label"
            value={currency}
            label={t('common:currency', 'Currency')}
            onChange={handleCurrencyChange}
          >
            {supportedCurrencies.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    )
  }

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
        <Switch
          activeSlide={showYearlyPrice ? 1 : 0}
          options={[
            {
              title: t('common:components.PlanSelection.interval.monthly', 'Monthly'),
            },
            {
              title: t('common:components.PlanSelection.interval.yearly', 'Annual'),
              extra: t('common:components.PlanSelection.interval.yearlySavings', {
                defaultValue: 'Save {{percentage}}%',
                percentage: yearlyPlanSavings,
              }),
            },
          ]}
          onChangeActiveSlide={(index) => setShowYearlyPrices(!!index)}
        />
      </Box>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={4} order={{ xs: 3, md: 1 }}>
          <Plan
            title={freePlanName}
            subtitle={t('common:components.PlanSelection.free.subtitle', 'For starters')}
            isCurrentPlan={!!customer?.userId && !isSubscriptionActive}
          >
            <Box
              display="flex"
              flexDirection={'column'}
              justifyContent="center"
              alignItems={'center'}
              mb={7}
            >
              <Price>{formatCurrency(0, currency, 0)}</Price>
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
            if (!prices.monthly || !prices.yearly) {
              return null
            }
            const price = showYearlyPrice ? prices?.yearly : prices?.monthly

            const isPremiumPlan = name === premiumPlanName

            const isCurrentlyActiveSubscriptionPlan =
              isSubscriptionActive &&
              price.product === activePrice?.product &&
              isSubscriptionBillingIntervalMatch

            return (
              <Grid item xs={12} sm={6} md={4} key={index} order={{ sm: ++index, xs: 1 }}>
                <Plan
                  isFeatured={
                    isCurrentlyActiveSubscriptionPlan || (!isSubscriptionActive && isPremiumPlan)
                  }
                  title={name}
                  subtitle={
                    <>
                      {isPremiumPlan
                        ? t('common:components.PlanSelection.premium.subtitle', 'For most People')
                        : t(
                            'common:components.PlanSelection.enterprise.subtitle',
                            'For Visionaries',
                          )}
                    </>
                  }
                  isCurrentPlan={isCurrentlyActiveSubscriptionPlan}
                >
                  <Box
                    display="flex"
                    flexDirection={'column'}
                    justifyContent="center"
                    alignItems={'center'}
                    mb={4}
                  >
                    <Price>
                      {formatCurrency(
                        Number(price.unit_amount) / 100 / (showYearlyPrice ? 12 : 1),
                        currency,
                      )}
                    </Price>

                    <Box display="flex" flexDirection={'column'}>
                      <span>{t('common:perMonth', 'per month')}</span>
                      {price.recurring?.interval === 'year' ? (
                        <>
                          <span>
                            {t('common:components.PlanSelection.amountBilledPerYear', {
                              defaultValue: 'billed {{amount}} annually',
                              amount: formatCurrency(Number(price.unit_amount) / 100, currency),
                            })}
                          </span>
                        </>
                      ) : (
                        <>
                          <span>
                            {t('common:components.PlanSelection.amountBilledPerMonth', {
                              defaultValue: 'billed {{amount}} a month',
                              amount: formatCurrency(Number(price.unit_amount) / 100, currency),
                            })}
                          </span>
                        </>
                      )}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <SimpleAccordion
                      name="premiumUsps"
                      items={getAccordionItems(isPremiumPlan ? premiumUsps : enterpriseUsps)}
                    />
                  </Box>

                  {isCurrentlyActiveSubscriptionPlan && (
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
                          </>
                        )}
                      </Alert>
                    </Box>
                  )}

                  <Box display="flex" flexDirection="column" alignItems="center" pb={2} mt={'auto'}>
                    {customer?.userId ? (
                      <>
                        {isCurrentlyActiveSubscriptionPlan && !isSubscriptionCanceled ? (
                          <BaseButton
                            variant="outlined"
                            color="primary"
                            onClick={() => deleteSubscription(subscription.id)}
                            loading={status?.type === 'loading'}
                          >
                            {t('common:button.cancelSubscription', 'Cancel subscription')}
                          </BaseButton>
                        ) : (
                          <BaseButton
                            size="large"
                            variant="contained"
                            fullWidth
                            color="primary"
                            onClick={() => handleSubmit(price.id)}
                            loading={status?.type === 'loading'}
                          >
                            {isCurrentlyActiveSubscriptionPlan && isSubscriptionCanceled
                              ? t('common:button.reactivatePlan', 'Reactivate plan')
                              : t('common:button.selectPlan', 'Select plan')}
                          </BaseButton>
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
                  </Box>
                </Plan>
              </Grid>
            )
          })}
      </Grid>
      <Box display={'flex'} justifyContent="center" pt={3}>
        <CurrencySelection />
      </Box>
    </Root>
  )
}

export default PlanSelection
