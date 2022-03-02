import { TFunction } from 'next-i18next'

import {
  blogUrl,
  chromeExtensionLink,
  firefoxExtensionLink,
  microsoftEdgeExtensionLink,
  twitterLink,
} from '@/constants'

export const secrets = (t: TFunction) => [
  {
    href: '/text',
    label: t('common:menu.secrets.text', 'Text'),
  },
  {
    href: '/files',
    label: t('common:menu.secrets.files', 'Files'),
  },
  {
    href: '/redirect',
    label: t('common:menu.secrets.redirect', 'Redirect'),
  },
  {
    href: '/neogram',
    label: t('common:menu.secrets.neogram', 'Neogram'),
  },
]

export const integrations = [
  {
    href: '/slack',
    label: 'Slack App',
  },
  {
    href: chromeExtensionLink,
    label: 'Google Chrome',
    prefetch: false,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    href: firefoxExtensionLink,
    label: 'Mozilla Firefox',
    prefetch: false,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    href: microsoftEdgeExtensionLink,
    label: 'Microsoft Edge',
    prefetch: false,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
]

export const information = (t: TFunction) => [
  {
    href: '/about',
    label: t('common:menu.about', 'About'),
  },
  {
    href: '/security',
    label: t('common:menu.security', 'Security'),
  },
  {
    href: '/privacy',
    label: t('common:menu.privacy', 'Privacy'),
  },
  {
    href: '/pricing',
    label: t('common:menu.pricing', 'Pricing'),
    prefetch: false,
  },
  {
    href: blogUrl,
    label: t('common:menu.blog', 'Developer Blog'),
    prefetch: false,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
]

export const support = (t: TFunction) => [
  {
    href: '/faq',
    label: t('common:menu.faq', 'FAQ'),
  },
  {
    href: '/contact',
    label: t('common:menu.contact', 'Contact'),
  },
  {
    href: twitterLink,
    prefetch: false,
    target: '_blank',
    rel: 'noopener noreferrer',
    label: 'Twitter',
  },
]

// Deprecate this
export const main = (t: TFunction) => [
  {
    href: '/',
    label: t('common:menu.home', 'Home'),
  },
  {
    href: '/about',
    label: t('common:menu.about', 'About'),
  },
  {
    href: '/security',
    label: t('common:menu.security', 'Security'),
  },
  {
    href: '/privacy',
    label: t('common:menu.privacy', 'Privacy'),
  },
  {
    href: '/pricing',
    label: t('common:menu.pricing', 'Pricing'),
    prefetch: false,
  },
  {
    href: '/faq',
    label: t('common:menu.faq', 'FAQ'),
  },
  {
    href: '/contact',
    label: t('common:menu.contact', 'Contact'),
  },
]

export const terms = (t: TFunction) => [
  {
    href: '/terms-of-service',
    label: t('common:menu.termsOfService', 'Terms of Service'),
  },
]

export const policies = (t: TFunction) => [
  {
    href: '/acceptable-use-policy',
    label: t('common:menu.acceptableUsePolicy', 'Acceptable Use Policy'),
  },
  {
    href: '/cookie-policy',
    label: t('common:menu.cookiePolicy', 'Cookie Policy'),
  },
  {
    href: '/privacy-policy',
    label: t('common:menu.privacyPolicy', 'Privacy Policy'),
  },
]

export const about = (t: TFunction) => [
  {
    href: '/imprint',
    label: t('common:menu.imprint', 'Imprint'),
  },
  {
    href: '/privacy-policy',
    label: t('common:menu.privacyPolicy', 'Privacy Policy'),
  },
  {
    href: '/cookie-policy',
    label: t('common:menu.cookiePolicy', 'Cookie Policy'),
  },
]
