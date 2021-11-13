import general from './general'
import slack from './slack'
import nerdZone from './nerdZone'
import securityAndPrivacy from './securityAndPrivacy'
import product from './product'
import accountAndBilling from './accountAndBilling'

export const faqCategories = [
  { id: 'general', title: 'General' },
  { id: 'product', title: 'Product and Service' },
  { id: 'securityAndPrivacy', title: 'Security and Privacy' },
  { id: 'accountAndBilling', title: 'Account and Billing' },
  { id: 'slack', title: 'Slack App' },
  { id: 'nerdZone', title: 'Nerd Zone' },
]

export const faq = [
  ...general,
  ...product,
  ...securityAndPrivacy,
  ...accountAndBilling,
  ...slack,
  ...nerdZone,
]

export const shortFaq = faq.filter(({ id }) =>
  ['why', 'who', 'how', 'secretTypes', 'security', 'recovery', 'notification', 'save'].includes(id),
)
