import { TFunction } from 'i18next'

const accountAndBilling = (t: TFunction) => [
  {
    id: 'payment-provider',
    category: 'accountAndBilling',
    heading: t('common:faq.payment-provider.heading', 'Who is the payment provider?'),
    body: t('common:faq.payment-provider.body', {
      defaultValue: `We work with {{paymentProcessor}} as our payment provider. We don't store any payment related information whatsoever.`,
      paymentProcessor: '[Stripe](https://stripe.com/)',
    }),
  },
  {
    id: 'payment-methods',
    category: 'accountAndBilling',
    heading: t('common:faq.payment-methods.heading', 'What payment methods are supported?'),
    body: t('common:faq.payment-methods.body', {
      defaultValue: `Our payment provider {{paymentProcessor}} offers a variety of payment options: Google Pay, Credit Card (VISA, Mastercard, American Express, etc.) among many others. Once you choose a premium plan you get redirected to Stripe where you can select your preferred method.`,
      paymentProcessor: '[Stripe](https://stripe.com/)',
    }),
  },
  {
    id: 'subscriptions',
    category: 'accountAndBilling',
    heading: t('common:faq.subscriptions.heading', 'How do subscriptions work?'),
    body: t(
      'common:faq.subscriptions.body',
      `Once you subscribe to a premium plan, you get instant access to the corresponding features for as long as the subscription lasts. You will be billed every month or year, based on the selected billing interval. A subscription can be cancelled anytime.`,
    ),
  },
  {
    id: 'promo-codes',
    category: 'accountAndBilling',
    heading: t('common:faq.promo-codes.heading', 'How can I use promo codes?'),
    body: t(
      'common:faq.promo-codes.body',
      `Promo codes can be applied on the Stripe checkout page. Add your personal promo code and hit "Apply". After that you should see a discounted price right away.`,
    ),
  },
  {
    id: 'end-subscription',
    category: 'accountAndBilling',
    heading: t('common:faq.end-subscription.heading', 'How do I cancel a subscription?'),
    body: t(
      'common:faq.end-subscription.body',
      `Sign in to the [account page](/account). Under the "Subscription" tab you can cancel your subscription anytime, **no questions asked**.`,
    ),
  },
]
export default accountAndBilling
