const securityAndPrivacy = [
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
]

export default securityAndPrivacy
