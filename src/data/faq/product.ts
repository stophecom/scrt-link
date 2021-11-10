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

const demoTextMessage = 'Hi there…\nThis is just a demo!\n\nEnjoy sharing secrets 😘'

export const demoNeogramMessage =
  'Hi there…\nThis is just a demo! Neogram messages self-destruct automatically after a defined period of time.\n\nEnjoy sharing secrets 😘'

const demoSecretMessageLink = `${baseUrl}/l/preview?preview=${encodeURIComponent(
  JSON.stringify({
    message: demoTextMessage,
    secretType: 'text',
  }),
)}`
const demoSecretNeogramLink = `${baseUrl}/l/preview?preview=${encodeURIComponent(
  JSON.stringify({
    message: demoNeogramMessage,
    secretType: 'neogram',
    neogramDestructionMessage: 'This message self-destructs in …',
    neogramDestructionTimeout: 3,
  }),
)}`

const product = [
  {
    id: 'secret-types',
    category: 'product',
    heading: 'What is the difference between *Text*, *Link* and *Neogram™*?',
    body: `
- **Text**: This is the standard mode. It's the preferred way to share passwords and similar kind of secrets. The recipient has the option to copy the secret.
[Demo](${demoSecretMessageLink})
- **Link**: Think about it as a URL-shortener where the generated link only works once.
- **Neogram™**: Digital letter-style message that automatically burns after reading. Use it for confidential notes, confessions or secret love letters. [Demo](${demoSecretNeogramLink})
    `,
  },

  {
    id: 'message-size',
    category: 'product',
    heading: 'What is the maximum message size?',
    body: `The current limit is ${formatNumber(
      limits.visitor.maxMessageLength,
    )} characters for visitors. With a premium plan you can get up to ${formatNumber(
      limits.premium.maxMessageLength,
    )} characters.`,
  },
  {
    id: 'notification',
    category: 'product',
    heading: 'Can I get notified when a secret has been viewed?',
    body: `Yes, you can get **SMS or Email notifications** with an account. [Go to Account](/account)`,
  },
  {
    id: 'read-receipts-info',
    category: 'product',
    heading: 'How do read receipts work?',
    body: `
For each secret, we generate a Secret ID (a random string) which is the only reference to the original message. Once the recipient opens the secret link, we notify you using the chosen method. In the notification we only include the Secret ID - so be sure to store/remember it. Needless to say, the contact information (email or phone number) is **never exposed to the recipient**.

**Email**: You'll receive an email from *${email}*.

**SMS**: You'll receive an SMS notification from *${twilioSenderPhoneNumber}*.
    `,
  },
  {
    id: 'secret-not-found',
    category: 'product',
    heading: 'Why do I get "Secret not found" error?',
    body: `
This means that the secret link has already been visited. If this happens unexpectedly:
- Check with the sender to make sure the link hasn't been visited by mistake.
- The secret was accessed via brut-force attack or there is an issue with the server infrastructure (don't worry, the contents of the secrets would still be encrypted) - both cases are very unlikely.
- **Worst case**: A third party accessed the link, which ultimately means, your communication channel and/or either party's device has been compromised. 
    `,
  },
  {
    id: 'browser-extensions',
    category: 'product',
    heading: 'Where can I find the browser extensions?',
    body: `The scrt.link browser extensions are available for all major browsers:
- [Google Chrome](${chromeExtensionLink})
- [Mozilla Firefox](${firefoxExtensionLink})
- [Microsoft Edge](${microsoftEdgeExtensionLink})
`,
  },
  {
    id: 'slack-app',
    category: 'product',
    heading: 'Where can I get the Slack App?',
    body: `
The Slack app lets you use the power of scrt.link without switching apps. Go to the [Slack App page](/slack) for more information. Or get the app right here:  

👉 [Install Slack App](${slackAppInstallLink})  

_**Important notice:** There are limitations when using the Slack Application. Due to the nature of how these apps are designed, full end-to-end encryption is not possible. In most cases this is not a problem and a risk worth taking - however, if you need advanced protection, create secrets on the website instead._
`,
  },
  {
    id: 'service-provider',
    category: 'general',
    heading: 'Who is behind this service?',
    body: `Scrt.link is a service by [SANTiHANS GmbH](https://santihans.com), a Swiss based tech company with a mission to advance the web. We operate under Swiss law. As a customer you profit from one of the world's strongest data and privacy protection regulation, the [Federal Act on Data Protection (FADP)](https://fedlex.data.admin.ch/eli/cc/1993/1945_1945_1945). This product has been created and is operated by [@stophecom](https://twitter.com/stophecom).`,
  },
]

export default product
