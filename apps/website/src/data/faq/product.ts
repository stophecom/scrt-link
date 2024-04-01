import { formatNumber } from '@/utils/localization'
import {
  baseUrl,
  limits,
  email,
  twilioSenderPhoneNumber,
  chromeExtensionLink,
  firefoxExtensionLink,
  microsoftEdgeExtensionLink,
  slackAppInstallLink,
} from '@/constants'
import { TFunction } from 'next-i18next'

export const demoNeogramMessage = (t: TFunction) =>
  t(
    'common:demoNeogramMessage',
    'Wake up Neo…\nThis is just a demo!\nNeogram messages self-destruct automatically after a defined period of time.\n\nEnjoy sharing secrets 😘',
  )

const demoSecretMessageLink = (t: TFunction) =>
  `${baseUrl}/l?preview=${encodeURIComponent(
    JSON.stringify({
      message: t(
        'common:demoTextMessage',
        'Hi there…\nThis is just a demo!\n\nEnjoy sharing secrets 😘',
      ),
      secretType: 'text',
    }),
  )}`
const demoSecretNeogramLink = (t: TFunction) =>
  `${baseUrl}/l?preview=${encodeURIComponent(
    JSON.stringify({
      message: demoNeogramMessage(t),
      secretType: 'neogram',
      neogramDestructionMessage: t(
        'common:demoNeogramDestructionMessage',
        'This message self-destructs in …',
      ),
      neogramDestructionTimeout: 3,
    }),
  )}`

const product = (t: TFunction) => [
  {
    id: 'secret-types',
    category: 'product',
    heading: t('common:faq.secret-types.heading', '*Text*, *Files*, *Redirect* and *Neogram*?'),
    body: t('common:faq.secret-types.body', {
      defaultValue: `- **Text**: This is the standard mode. It's the preferred way to share passwords and similar kind of secrets. The recipient has the option to copy the secret.
[Demo]({{ demoSecretMessageLink }})
- **File**: Drop any file. This feature is currently in beta.
- **Redirect**: Think about it as a URL-shortener where the generated link only works once.
- **Neogram**: Digital letter-style message that automatically burns after reading. Use it for confidential notes, confessions or secret love letters. [Demo]({{ demoSecretNeogramLink }})`,
      demoSecretMessageLink: demoSecretMessageLink(t),
      demoSecretNeogramLink: demoSecretNeogramLink(t),
    }),
  },

  {
    id: 'message-size',
    category: 'product',
    heading: t('common:faq.message-size.heading', 'What is the maximum message size?'),
    body: t('common:faq.message-size.body', {
      defaultValue: `The current limit is {{ maxMessageLengthVisitor }} characters for visitors. With a premium plan you can get up to {{ maxMessageLengthPremium }} characters.`,
      maxMessageLengthVisitor: formatNumber(limits.visitor.maxMessageLength),
      maxMessageLengthPremium: formatNumber(limits.premium.maxMessageLength),
    }),
  },
  {
    id: 'notification',
    category: 'product',
    heading: t(
      'common:faq.notification.heading',
      'Can I get notified when a secret has been viewed?',
    ),
    body: t(
      'common:faq.notification.body',
      `Yes, you can get **Ntfy or Email notifications** with an account. [Go to Account](/account)`,
    ),
  },
  {
    id: 'read-receipts-info',
    category: 'product',
    heading: t('common:faq.read-receipts-info.heading', 'How do read receipts work?'),
    body: t('common:faq.read-receipts-info.body', {
      defaultValue: `For each secret, we generate a Secret ID (a random string) which is the only reference to the original message. Once the recipient opens the secret link, we notify you using the chosen method. In the notification we only include the Secret ID - so be sure to store/remember it. Needless to say, the contact information (email or phone number) is **never exposed to the recipient**.

**Email**: You'll receive an email from *{{ email }}*.`,
      email,
      twilioSenderPhoneNumber,
    }),
  },
  {
    id: 'secret-not-found',
    category: 'product',
    heading: t('common:faq.secret-not-found.heading', 'Why do I get "Secret not found" error?'),
    body: t(
      'common:faq.secret-not-found.body',
      `This means that the secret link has already been visited. If this happens unexpectedly:
- Check with the sender to make sure the link hasn't been visited by mistake.
- The secret was accessed via brut-force attack or there is an issue with the server infrastructure (don't worry, the contents of the secrets would still be encrypted) - both cases are very unlikely.
- **Worst case**: A third party accessed the link, which ultimately means, your communication channel and/or either party's device has been compromised.`,
    ),
  },
  {
    id: 'browser-extensions',
    category: 'product',
    heading: t('common:faq.browser-extensions.heading', 'Where can I find the browser extensions?'),
    body: t('common:faq.browser-extensions.body', {
      defaultValue: `The scrt.link browser extensions are available for all major browsers:
- [Google Chrome]({{ chromeExtensionLink }})
- [Mozilla Firefox]({{ firefoxExtensionLink }})
- [Microsoft Edge]({{ microsoftEdgeExtensionLink }})`,
      chromeExtensionLink,
      firefoxExtensionLink,
      microsoftEdgeExtensionLink,
    }),
  },
  {
    id: 'slack-app',
    category: 'product',
    heading: t('common:faq.slack-app.heading', 'Where can I get the Slack App?'),
    body: t('common:faq.slack-app.body', {
      defaultValue: `The Slack app lets you use the power of scrt.link without switching apps. Go to the [Slack App page](/slack) for more information. Or get the app right here:  

👉 [Install Slack App]({{ slackAppInstallLink }})  

_**Important notice:** There are limitations when using the Slack Application. Due to the nature of how these apps are designed, full end-to-end encryption is not possible. In most cases this is not a problem and a risk worth taking - however, if you need advanced protection, create secrets on the website instead._`,
      slackAppInstallLink,
    }),
  },
]

export default product
