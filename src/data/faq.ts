import { twitterLink } from '@/constants'

export const faq = [
  {
    heading: 'How does it work?',
    body: `
After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Matrix, Signal or Threema.) After the recepients clicks the link, the message gets displayed and permanently removed from the server. 
    
For **extra security**, you can include a password that will be needed to decrypt the message. (We recommend to share the password via a different channel then the link.)`,
  },
  {
    heading: 'What is the difference between *Message*, *URL Redirect* and *Neogram™*?',
    body: `
- **Message**: This is the standard mode. It's the preferred way to share passwords and similar kind of secrets. The recepient has the option to copy the secret.
- **URL Redirect**: Think about it as a URL-shortener where the generated link only works once.
- **Neogram™**: Digital letter-style message that automatically burns after reading. Use it for confidential mission instructions, confessions or secret love letters.
    `,
  },
  {
    heading: 'Why should I use this service?',
    body: `
Sharing secrets is delicate. You don't want sensitive information (confidential information, passwords, access tokens, key combinations, confessions, etc.) to stay in your Slack channel, Whatsapp chat log, inbox, or any other communications channel. A one-time disposable link guarantees that your secret is only viewed exactly once, before being permanently destroyed.

**Use this service in case you want to…**
- Share your Netflix password with a family member.
- Send a private message from a friends phone.
- Confess to a secret crush without the fear of being exposed.
- Transmit information that could be used against you.
`,
  },
  {
    heading: 'How secure is your service?',
    body: `All messages are stored encrypted using **AES-256** with a 512bit hash. AES-256 is virtually impenetrable using brute-force methods. AES would take billions of years to break using current computing technology.
    For the highest level of security, an optional password (which is never stored) will be used to encrypt your message. Even if an attacker had access to **all of our infrastructure**, he or she couldn't decrypt your message. Read more on our [Security page](/security).`,
  },
  {
    heading: 'Can I retrieve a secret that has already been shared?',
    body: `Nope. We show it once and then delete it permanently from the database. There is no backup. It's gone for good.`,
  },
  {
    heading: 'What is the maximum message size?',
    body: `The current limit is 280 characters. Need more? Get in touch!`,
  },
  {
    heading: 'Can the recepient save the message?',
    body: `Sure. You can always take a screenshot. The idea behind this service is to securely share sensitive information one time. We (obviously) don't have control over what a recepient does with the message.`,
  },
  {
    heading: 'How long do you keep non-viewed secrets?',
    body: `Until the end of times. Seriously, there is no maximum time limit set. But you can always destroy your secret by visiting the secret link.`,
  },
  {
    heading: 'Why should I trust you?',
    body: `
Information without context is useless. Let's say you share a password - we have no way of knowing what service and/or username it belongs to. If you include a password, we use it to encrypt your secret message on the client. We don't store the password so we can never know what the secret is because we can't decrypt it.  
However, don't take our word for it - see for yourself: The project is open-source and all code is available on [Gitlab](https://gitlab.com/kingchiller/scrt-link).
`,
  },
]
