import { baseUrl, limits } from '@/constants'
const why = {
  heading: 'Why should I use this service?',
  body: `
Sharing secrets is delicate. You don't want sensitive information (confidential information, passwords, access tokens, key combinations, confessions, etc.) to stay in your Slack channel, Whatsapp chat log, inbox, or any other communication channel. A one-time disposable link guarantees that your secret is only viewed exactly once, before being permanently destroyed.

**Use this service in case you want to…**
- Share your Netflix password with a family member.
- Send a private message from a public computer.
- Confess to a secret crush.
- Transmit information that could be used against you.
`,
}

const how = {
  heading: 'How does the service work?',
  body: `
After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Signal, Threema or Matrix.) After the recipients clicks the link, the message gets displayed and permanently removed from the database. 
    
For **extra security**, you can include a password that will be needed to decrypt the message. (We recommend to share the password via a different channel than the link.)`,
}

const who = {
  heading: 'Who is it for?',
  body: `Essentially everybody. Everybody should care about privacy.  
  The means to transmit sensitive information anonymously is especially crucial for journalists, lawyers, politicians, whistleblowers, people who are being oppressed, etc.
`,
}

export const demoMessage = 'Hi there…\nThis is just a demo!\n\nEnjoy sharing secrets 😘'
const demoSecretMessageLink = `${baseUrl}/l/preview?preview=${encodeURIComponent(
  JSON.stringify({
    message: demoMessage,
    secretType: 'text',
  }),
)}`
const demoSecretNeogramLink = `${baseUrl}/l/preview?preview=${encodeURIComponent(
  JSON.stringify({
    message: demoMessage,
    secretType: 'neogram',
    neogramDestructionMessage: 'This message self-destructs in …',
    neogramDestructionTimeout: 3,
  }),
)}`

const secretTypes = {
  heading: 'What is the difference between *Text*, *Redirect* and *Neogram™*?',
  body: `
- **Text**: This is the standard mode. It's the preferred way to share passwords and similar kind of secrets. The recipient has the option to copy the secret.
[Demo](${demoSecretMessageLink})
- **Redirect**: Think about it as a URL-shortener where the generated link only works once.
- **Neogram™**: Digital letter-style message that automatically burns after reading. Use it for confidential notes, confessions or secret love letters. [Demo](${demoSecretNeogramLink})
    `,
}

const security = {
  heading: 'How secure is your service?',
  body: `All messages are end-to-end encrypted using **AES-256**, which is virtually impenetrable using brute-force methods. AES would take billions of years to break using current computing technology.
    For the highest level of security, an optional password (which is never stored either) will be used to encrypt your message. Read more on our [Security page](/security).`,
}

const recovery = {
  heading: 'Can I retrieve a secret that has already been shared?',
  body: `Nope. It's a one time secret. We show it once and then delete it permanently from the database. There is no backup. It's gone for good.`,
}

const notification = {
  heading: 'Can I get notified when a secret has been viewed?',
  body: `Yes, you can get SMS or Email notifications with an account. [Go to Account](/account)`,
}

const save = {
  heading: 'Can the recipient save the message?',
  body: `Sure. You can always take a screenshot. The idea behind this service is to securely share sensitive information one time. We (obviously) don't have control over what a recipient does with the message.`,
}

export const shortFaq = [why, who, how, secretTypes, security, recovery, notification, save]

export const faq = [
  why,
  {
    heading: `What is the difference to disappearing messages on Signal or Whatsapp?`,
    body: `Anonymity, privacy and security. Plain text messages within a chat log can always get tracked back to you. There are many scenarios where even disappearing messages are a risk factor: Do other people have access to your phone sometimes? What if you lost your phone? Or even worse, your phone might be compromised on an operating system level.  With scrt.link you will always just have a link in your conversation history. After the link has been visited once, it will lead to a 404 error page. There is no way of accessing the original content.
`,
  },
  {
    heading: `What is the difference to Snapchat?`,
    body: `Same answer as for the previous question. Also, the business model behind Snapchat, and every other major social media platform, contradicts the idea of privacy and anonymity. Social media companies need to know their users in order to sell ads. 
    
However, it is fine to share a generated secret link using Snapchat, Facebook, Instagram, Telegram, etc.
`,
  },
  how,
  secretTypes,
  security,
  {
    heading: 'How is end-to-end encryption achieved?',
    body: `We generate two random strings, one to identify your secret in the database and one to encrypt your message. We don't store the encryption key. Only with the full link you are able to descrypt the secret.
![Link explanation](/images/link-explanation.svg)
`,
  },
  recovery,
  {
    heading: 'What is the maximum message size?',
    body: `The current limit is ${limits.visitor.maxMessageLength} characters for visitors. With a premium plan you can get up to ${limits.premium.maxMessageLength} characters.`,
  },
  notification,
  save,
  {
    heading: 'How long do you keep non-viewed secrets?',
    body: `Until the end of times. Seriously, there is no maximum time limit set. But you can always destroy your secret by visiting the secret link.`,
  },
  {
    heading: 'Who is behind this service?',
    body: `Hi, it's [@stophecom](https://twitter.com/stophecom), web developer and designer who cares about privacy and the open web.`,
  },
]
