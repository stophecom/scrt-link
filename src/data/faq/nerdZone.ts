import { TFunction } from 'next-i18next'

const nerdZoneFaq = (t: TFunction) => [
  {
    id: 'developer',
    category: 'nerdZone',
    heading: t('common:faq.developer.heading', 'Where can I find the source code?'),
    body: t('common:faq.developer.body', {
      defaultValue: `All code is open-source on {{gitlabLink}}`,
      gitlabLink: '[Gitlab](https://gitlab.com/kingchiller/scrt-link).',
    }),
  },
  {
    id: 'developer-tools',
    category: 'nerdZone',
    heading: t('common:faq.developer-tools.heading', 'How can integrate this tool in my project?'),
    body: t(
      'common:faq.developer-tools.body',
      `There are easy-to-use npm packages available. For code examples and further information about integration visit the [developer blog](https://blog.stophe.com/scrtlink-is-built-for-developers).`,
    ),
  },
]

export default nerdZoneFaq
