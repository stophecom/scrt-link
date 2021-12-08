import { TFunction } from 'next-i18next'

import general from './general'
import slack from './slack'
import nerdZone from './nerdZone'
import securityAndPrivacy from './securityAndPrivacy'
import product from './product'
import accountAndBilling from './accountAndBilling'

export const faqCategories = (t: TFunction) => [
  { id: 'general', title: t('common:faq.category.general', 'General') },
  { id: 'product', title: t('common:faq.category.product', 'Product and Service') },
  {
    id: 'securityAndPrivacy',
    title: t('common:faq.category.securityAndPrivacy', 'Security and Privacy'),
  },
  {
    id: 'accountAndBilling',
    title: t('common:faq.category.accountAndBilling', 'Account and Billing'),
  },
  { id: 'slack', title: t('common:faq.category.slack', 'Slack App') },
  { id: 'nerdZone', title: t('common:faq.category.nerdZone', 'Nerd Zone') },
]

export const faq = (t: TFunction) => [
  ...general(t),
  ...product(t),
  ...securityAndPrivacy(t),
  ...accountAndBilling(t),
  ...slack(t),
  ...nerdZone(t),
]

export const shortFaq = (t: TFunction) =>
  faq(t).filter(({ id }) =>
    ['why', 'who', 'how', 'secretTypes', 'security', 'recovery', 'notification', 'save'].includes(
      id,
    ),
  )
