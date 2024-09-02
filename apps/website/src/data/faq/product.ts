import { formatNumber } from '@/utils/localization'
import { baseUrl, limits, email } from '@/constants'
import { TFunction } from 'i18next'

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
]

export default product
