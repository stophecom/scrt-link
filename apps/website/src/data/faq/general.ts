import { TFunction } from 'i18next'
const general = (t: TFunction) => [
  {
    id: 'why',
    category: 'general',
    heading: t('common:faq.why.heading', 'Why should I use this service?'),
    body: t(
      'common:faq.why.body',
      `Sharing secrets is delicate. You don't want sensitive information (confidential information, passwords, API keys, access tokens, key combinations, confessions, etc.) to stay in your Slack channel, Whatsapp chat log, inbox, or any other communication channel. A one-time disposable link guarantees that your secret is only viewed exactly once, before being permanently destroyed.

**Use this service in case you want to…**
- Share your Netflix password with a family member.
- Send a private message from a public computer.
- Send access tokens, API keys, PIN codes to a friend or coworker.
- Forward payment information such as credit card number or Bitcoin wallet address.
- Confess to a secret crush.
- Transmit information that could be used against you.`,
    ),
  },
  {
    id: 'who',
    category: 'general',
    heading: t('common:faq.who.heading', 'Who is it for?'),
    body: t(
      'common:faq.who.body',
      `Essentially everybody. Everybody should care about privacy.  
  The means to transmit sensitive information anonymously is especially crucial for journalists, lawyers, politicians, whistleblowers, people who are being oppressed, etc.`,
    ),
  },
  {
    id: 'how',
    category: 'general',
    heading: t('common:faq.how.heading', 'How does the service work?'),
    body: t(
      'common:faq.how.body',
      `After you submit the form your secret will be encrypted and stored. You can now share the generated short link via text message, email or whatever service you trust. (We recommend Signal, Threema or Matrix.) After the recipients clicks the link, the message gets displayed and permanently removed from the database. 
    
For **extra security**, you can include a password that will be needed to decrypt the message. (We recommend to share the password via a different channel than the link.)`,
    ),
  },
  {
    id: 'difference-to-disappearing-messages',
    category: 'general',
    heading: t(
      'common:faq.difference-to-disappearing-messages.heading',
      `What is the difference to disappearing messages on Signal or Whatsapp?`,
    ),
    body: t(
      'common:faq.difference-to-disappearing-messages.body',
      `Anonymity, privacy and security. Plain text messages within a chat log can always get traced back to you. There are many scenarios where even disappearing messages are a risk factor: Do other people have access to your phone sometimes? What if you lost your phone? Or even worse, your phone might be compromised on an operating system level. With scrt.link you will always just have a link in your conversation history. After the link has been visited once, it will lead to a 404 error page. There is no way of accessing the original content.`,
    ),
  },
  {
    id: 'difference-to-snapchat',
    category: 'general',
    heading: t('common:faq.difference-to-snapchat.heading', `What is the difference to Snapchat?`),
    body: t(
      'common:faq.difference-to-snapchat.body',
      `Same answer as for the previous question. Also, the business model behind Snapchat, and every other major social media platform, contradicts the idea of privacy and anonymity. Social media companies need to know their users in order to sell ads. 
    
However, it is fine to share a generated secret link using Snapchat, Facebook, Instagram, Telegram, etc.`,
    ),
  },
  {
    id: 'service-provider',
    category: 'general',
    heading: t('common:faq.service-provider.heading', 'Who is behind this service?'),
    body: t(
      'common:faq.service-provider.body',
      `Scrt.link is a service by [SANTiHANS GmbH](https://santihans.com), a Swiss based tech company with a mission to advance the web. We operate under Swiss law. As a customer you profit from one of the world's strongest data and privacy protection regulation, the [Federal Act on Data Protection (FADP)](https://fedlex.data.admin.ch/eli/cc/1993/1945_1945_1945). This product has been created and is operated by [@stophecom](https://twitter.com/stophecom).`,
    ),
  },
]

export default general
