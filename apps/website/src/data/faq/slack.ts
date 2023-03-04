import { TFunction } from 'next-i18next'

const slackAppFaq = (t: TFunction) => [
  {
    id: 'slack-security',
    category: 'slack',
    heading: t('common:faq.slack-security.heading', 'Is the Slack App secure?'),
    body: t(
      'common:faq.slack-security.body',
      `The honest answer: We can't know for sure. It's important to understand that **end-to-end-encryption is not possible** with Slack apps. However, the communication between our app server and Slack is encrypted and we therefore believe that for 99% of use cases it's safe to use. Still, please be aware that **Slack is proprietary software** and we don't have control over code that runs your Slack instance. **In case you need to be 100% sure, create secrets via the website instead.**`,
    ),
  },
  {
    id: 'slack-trust',
    category: 'slack',
    heading: t('common:faq.slack-trust.heading', 'Why should I trust you?'),
    body: t('common:faq.slack-trust.body', {
      defaultValue: `Short answer: Don't. That said, we believe in trust through transparency. While you might have something to hide, we don't. That's why all code is open source and available on {{gitlabLink}}. Feel free to launch your own private Slack App.`,
      gitlabLink: '[Gitlab](https://gitlab.com/kingchiller/scrt-link-slack)',
    }),
  },
  {
    id: 'slack-data-collection',
    category: 'slack',
    heading: t('common:faq.slack-data-collection.heading', 'What data do you collect?'),
    body: t(
      'common:faq.slack-data-collection.body',
      `We only store data that is necessary to run the app. When you install the app, you grant us specific access rights (e.g. the right to post a secret link in your name). This data includes basic Slack user information (e.g. username, id) as well as the individual authorization tokens. Additionally, we temporarily store data required for read receipts.  
**We don't store any other data. We do not repurpose, sell or distribute any data we collect. Even if we wanted to, we are not able to identify you as a person, since only Slack may have the relevant information to do so.**`,
    ),
  },
  {
    id: 'slack-not-approved',
    category: 'slack',
    heading: t('common:faq.slack-not-approved.heading', `Why isn't this app approved by Slack?`),
    body: t(
      'common:faq.slack-not-approved.body',
      `First, it's important to understand that this app can still be installed and used in the exact same way as officially listed apps. That said, we tried to submit our app to the Slack App Directory to get listed. But since Slack is literally "restricting the approval of apps that facilitate the sharing of sensitive information" we were not able to do so. Now think about this for a minute. And afterwards, help us spread the word 🥰`,
    ),
  },
  {
    id: 'slack-scopes',
    category: 'slack',
    heading: t('common:faq.slack-scopes.heading', 'What permissions are required?'),
    body: t(
      'common:faq.slack-scopes.body',
      `The app requires basic information about the user, channels and conversations. Additionally, the app needs the permission to post in your name, join a conversation and make use of _slash commands_ and _shortcuts_. You'll get more detailed information about permission scopes during the app installation.`,
    ),
  },
  {
    id: 'slack-user-account',
    category: 'slack',
    heading: t(
      'common:faq.slack-user-account.heading',
      'Do I need an account to use the Slack app?',
    ),
    body: t('common:faq.slack-user-account.body', `No. Currently not. You are welcome.`),
  },
  {
    id: 'slack-premium-account',
    category: 'slack',
    heading: t(
      'common:faq.slack-premium-account.heading',
      'Do I need a premium subscription to use the Slack app?',
    ),
    body: t(
      'common:faq.slack-premium-account.body',
      `No. You are very welcome. But, you may of course support this project with a paid subscriptions regardless 🤓.`,
    ),
  },
]

export default slackAppFaq
