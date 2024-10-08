import { TFunction } from 'i18next'

import general from './general'

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
]

export const faq = (t: TFunction) => [
  ...general(t),
  ...product(t),
  ...securityAndPrivacy(t),
  ...accountAndBilling(t),
]

export const shortFaq = (t: TFunction) =>
  faq(t).filter(({ id }) =>
    ['why', 'who', 'how', 'secretTypes', 'security', 'recovery', 'notification', 'save'].includes(
      id,
    ),
  )
