import {
  baseUrl,
  limits,
  chromeExtensionLink,
  firefoxExtensionLink,
  microsoftEdgeExtensionLink,
  slackAppInstallLink,
  email,
  twilioSenderPhoneNumber,
  trialPeriod,
} from '@/constants'
import { formatNumber } from '@/utils/localization'

export const demoTextMessage = 'Hi there…\nThis is just a demo!\n\nEnjoy sharing secrets 😘'

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

export const faqCategories = [
  { id: 'general', title: 'General' },
  { id: 'product', title: 'Product and Service' },
  { id: 'securityAndPrivacy', title: 'Security and Privacy' },
  { id: 'accountAndBilling', title: 'Account and Billing' },
  { id: 'nerdZone', title: 'Nerd Zone' },
]

export const faq = [
  {
    id: 'why',
    category: 'general',
    heading: 'Why should I use this service?',
    body: `
Sharing secrets is delicate. You don't want sensitive information (confidential information, passwords, API keys, access tokens, key combinations, confessions, etc.) to stay in your Slack channel, Whatsapp chat log, inbox, or any other communication channel. A one-time disposable link guarantees that your secret is only viewed exactly once, before being permanently destroyed.

**Use this service in case you want to…**
- Share your Netflix password with a family member.
- Send a private message from a public computer.
- Send access tokens, API keys, PIN codes to a coworker.
- Confess to a secret crush.
- Transmit information that could be used against you.
`,
  },
  {
    id: 'who',
    category: 'general',
    heading: 'Who is it for?',
    body: `Essentially everybody. Everybody should care about privacy.  
  The means to transmit sensitive information anonymously is especially crucial for journalists, lawyers, politicians, whistleblowers, people who are being oppressed, etc.
`,
  },
  {
    id: 'how',
    category: 'general',
    heading: 'How does the service work?',
    body: `
After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Signal, Threema or Matrix.) After the recipients clicks the link, the message gets displayed and permanently removed from the database. 
    
For **extra security**, you can include a password that will be needed to decrypt the message. (We recommend to share the password via a different channel than the link.)`,
  },
  {
    id: 'difference-to-disappearing-messages',
    category: 'general',
    heading: `What is the difference to disappearing messages on Signal or Whatsapp?`,
    body: `Anonymity, privacy and security. Plain text messages within a chat log can always get traced back to you. There are many scenarios where even disappearing messages are a risk factor: Do other people have access to your phone sometimes? What if you lost your phone? Or even worse, your phone might be compromised on an operating system level. With scrt.link you will always just have a link in your conversation history. After the link has been visited once, it will lead to a 404 error page. There is no way of accessing the original content.
`,
  },
  {
    id: 'difference-to-snapchat',
    category: 'general',
    heading: `What is the difference to Snapchat?`,
    body: `Same answer as for the previous question. Also, the business model behind Snapchat, and every other major social media platform, contradicts the idea of privacy and anonymity. Social media companies need to know their users in order to sell ads. 
    
However, it is fine to share a generated secret link using Snapchat, Facebook, Instagram, Telegram, etc.
`,
  },
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
    id: 'security',
    category: 'securityAndPrivacy',
    heading: 'How secure is this service?',
    body: `All messages are end-to-end encrypted using **AES-256**, which is virtually impenetrable using brute-force methods. AES would take billions of years to break using current computing technology.
    For the highest level of security, an optional password (which is never stored either) will be used to encrypt your message. Read more on our [Security page](/security).`,
  },
  {
    id: 'anonymity',
    category: 'securityAndPrivacy',
    heading: 'How is my privacy protected?',
    body: `
We take a number of steps to protect your privacy, detailed on the [privacy page](/privacy) - however some of the features require third party services that may have access to personal identifiable information (PII). If you want to further protect your privacy, we recommend the following:

- Connect to our service via a virtual private network (VPN): This way you never expose your personal IP address. We recommend [ProtonVPN](https://protonvpn.com/).
- Use a service such as [Abine Blur](https://www.abine.com/) to hide your personal email address, phone number and/or credit card information.
    `,
  },
  {
    id: 'end-to-end-encryption-nfo',
    category: 'securityAndPrivacy',
    heading: 'How is end-to-end encryption achieved?',
    body: `We generate two random strings, one to identify your secret in the database and one to encrypt your message. We don't store the encryption key. Only with the full link you are able to decrypt the secret.
![Link explanation](/images/link-explanation.svg)
`,
  },
  {
    id: 'recovery',
    category: 'securityAndPrivacy',
    heading: 'Can I retrieve a secret that has already been visited?',
    body: `Nope. It's a **one time secret**. We show it once and then delete it permanently from the database. There is no backup. It's gone for good.`,
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
    id: 'save',
    category: 'securityAndPrivacy',
    heading: 'Can the recipient save the message?',
    body: `Sure. You can always take a screenshot. The idea behind this service is to securely share sensitive information one time. We (obviously) don't have control over what a recipient does with the message.`,
  },
  {
    id: 'secret-expiration',
    category: 'securityAndPrivacy',
    heading: 'How long do you keep non-viewed secrets?',
    body: `Until the end of times. Seriously, there is no maximum time limit set. But you can always destroy your secret by visiting the secret link.`,
  },
  {
    id: 'payment-provider',
    category: 'accountAndBilling',
    heading: 'Who is the payment provider? ',
    body: `We work with [Stripe](https://stripe.com/) as our payment provider. We don't store any payment related information whatsoever.`,
  },
  {
    id: 'payment-methods',
    category: 'accountAndBilling',
    heading: 'What payment methods are supported? ',
    body: `Our payment provider [Stripe](https://stripe.com/) offers a variety of payment options: Google Pay, Credit Card (VISA, Mastercard, American Express, etc.) among many others. Once you choose a premium plan you get redirected to Stripe where you can select your preferred method.`,
  },
  {
    id: 'subscriptions',
    category: 'accountAndBilling',
    heading: 'How do subscriptions work?',
    body: `Once you subscribe to a premium plan, you get instant access to the corresponding features for as long as the subscription lasts. You will be billed every month or year, based on the selected billing interval. A subscription can be cancelled anytime.`,
  },
  {
    id: 'trial',
    category: 'accountAndBilling',
    heading: 'How do trials work?',
    body: `**Try before you buy**: You can test all premium features for a **${trialPeriod} day trial period**. Once the trial ends you will be billed based on your chosen plan. Cancellations during the trial period result in the immediate termination of the subscription - **no billing** will be made in such case.`,
  },
  {
    id: 'end-subscription',
    category: 'accountAndBilling',
    heading: 'How do I cancel a subscription?',
    body: `Sign in to the [account page](/account). Under the "Subscription" tab you can cancel your subscription anytime, **no questions asked**.`,
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
    id: 'developer',
    category: 'nerdZone',
    heading: 'Where can I find the source code?',
    body: `All code is open-source on [Gitlab](https://gitlab.com/kingchiller/scrt-link).
`,
  },
  {
    id: 'developer-tools',
    category: 'nerdZone',
    heading: 'How can integrate this tool in my project?',
    body: `There are easy-to-use npm packages available. For code examples and further information about integration visit the [developer blog](https://blog.stophe.com/scrtlink-is-built-for-developers).
`,
  },
  {
    id: 'service-provider',
    category: 'general',
    heading: 'Who is behind this service?',
    body: `Scrt.link is a service by [SANTiHANS GmbH](https://santihans.com), a Swiss based tech company with a mission to advance the web. We operate under Swiss law. As a customer you profit from one of the world's strongest data and privacy protection regulation, the [Federal Act on Data Protection (FADP)](https://fedlex.data.admin.ch/eli/cc/1993/1945_1945_1945). This product has been created and is operated by [@stophecom](https://twitter.com/stophecom).`,
  },
]

export const shortFaq = faq.filter(({ id }) =>
  ['why', 'who', 'how', 'secretTypes', 'security', 'recovery', 'notification', 'save'].includes(id),
)

export const slackAppFaq = [
  {
    id: 'slack-security',
    category: 'slack',
    heading: 'Is the Slack App secure?',
    body: `Yes, for 99% of use cases it's safe to use. As mentioned above, it's important to know that **Slack is proprietary software**. We don't know what's going on behind the curtain. In case you need to be 100% sure, create secrets via the website instead.`,
  },
  {
    id: 'slack-trust',
    category: 'slack',
    heading: 'Why should I trust you?',
    body: `Short answer: Don't. Long answer: We believe in trust through transparency. While you might have something to hide, we don't. That's why all code is open source and available on [Gitlab](https://gitlab.com/kingchiller/scrt-link-slack). Feel free to launch your own private Slack App.`,
  },
  {
    id: 'slack-data-collection',
    category: 'slack',
    heading: 'What data do you collect?',
    body: `When you install the app, you grant us specific access rights (permission scopes) that are necessary to run the app (e.g. the right to post a secret link in your name). We store this installation data. The data includes basic user information as well as the individual authorization tokens. Additionally, we temporarily store data required for read receipts. We don't store any other data. We do not use data for any other purpose, nor do we sell or distribute any data.`,
  },
  {
    id: 'slack-not-approved',
    category: 'slack',
    heading: `Why isn't this app approved by Slack?`,
    body: `We are working on submitting the app to the Slack App Directory to get officially listed. This process may take several weeks to complete.`,
  },
  {
    id: 'slack-scopes',
    category: 'slack',
    heading: 'What permissions are required?',
    body: `The app requires basic information about the user, channels and conversations. Additionally, the app needs the permission to post in your name, join a conversation and make use of _slash commands_ and _shortcuts_. You'll get more detailed information about permission scopes during the app installation.`,
  },
  {
    id: 'slack-user-account',
    category: 'slack',
    heading: 'Do I need an account to use the Slack app?',
    body: `No. Currently not. You are welcome.`,
  },
  {
    id: 'slack-premium-account',
    category: 'slack',
    heading: 'Do I need a premium subscription to use the Slack app?',
    body: `No. You are very welcome welcome. (Paid subscriptions help us to keep it that way)`,
  },
]
