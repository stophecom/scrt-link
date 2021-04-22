export const faq = [
  {
    heading: 'Why should I use this service?',
    body: `
Sharing secrets is delicate. You don't want sensitive information (confidential information, passwords, access tokens, key combinations, confessions, etc.) to stay in your Slack channel, Whatsapp chat log, inbox, or any other communications channel. A one-time disposable link guarantees that your secret is only viewed exactly once, before being permanently destroyed.

**Use this service in case you want to…**
- Share your Netflix password with a family member.
- Send a private message from a public computer.
- Confess to a secret crush.
- Transmit information that could be used against you.
`,
  },
  {
    heading: `What is the difference to disappearing messages on Signal or Whatsapp?`,
    body: `Anonymity, privacy and security. Plain text messages within a chat log can always get tracked back to you. There are many scenarios where even disappearing messages are a risk factor: Do other people have access to your phone sometimes? What if you lost your phone? Or even worse, your phone might get compromised on an operating system level.  With scrt.link you will always just have a link in your conversation history. After the link has been visited once, it will lead to a 404 error page. There is not way of accessing the original content.
`,
  },
  {
    heading: `What is the difference to Snapchat?`,
    body: `Same answer as for the previous question. Also, the business model behind Snapchat, and every other major social media platform, contradicts the idea of privacy and anonymity. Social media companies need to know their users in order to sell ads. 
    
However, it is fine to share a generated secret link using Snapchat, Facebook, Instagram, Telegram, etc.
`,
  },
  {
    heading: 'How does the service work?',
    body: `
After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Signal, Threema or Matrix.) After the recepients clicks the link, the message gets displayed and permanently removed from the database. 
    
For **extra security**, you can include a password that will be needed to decrypt the message. With a password you achieve **full end-to-end encryption**. (We recommend to share the password via a different channel then the link.)`,
  },
  {
    heading: 'What is the difference between *Message*, *URL Redirect* and *Neogram™*?',
    body: `
- **Message**: This is the standard mode. It's the preferred way to share passwords and similar kind of secrets. The recepient has the option to copy the secret.
- **URL Redirect**: Think about it as a URL-shortener where the generated link only works once.
- **Neogram™**: Digital letter-style message that automatically burns after reading. Use it for confidential notes, confessions or secret love letters.
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
    body: `The current limit is 280 characters. Need more? [Go top secret!](/00)`,
  },
  {
    heading: 'Can I get notified when a secret has been viewed?',
    body: `This feature will be availble soon: [Go top secret!](/00)`,
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
    heading: 'Who is behind this service?',
    body: `Hi, it's [@stophecom](https://twitter.com/stophecom), web develper and designer who cares about privacy and the open web.`,
  },
]
