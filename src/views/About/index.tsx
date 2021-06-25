import React from 'react'
import Markdown from '@/components/Markdown'

import Page from '@/components/Page'
import Section from '@/components/Section'

const About = () => (
  <Page
    title="About"
    subtitle={`The whole project is based on a simple premise: The less we know, the better.`}
    intro={`It all started with the idea to send private messages in a fun way. Messages that don't persist. Think Snapchat, but without giving away your user data. The idea grew into a project that could be summarized as "Sharing secrets as a service". There are similar products out there - in fact, some have been a great inspiration. However, what sets scrt.link apart is the combination of all the great ideas and concepts around security and privacy, with the attention on design and user experience. Stay tuned - there is for more come!`}
  >
    <Section title={'Philosophy'}>
      <Markdown
        source={`
Freedom of speech, freedom of the press, and the right to privacy are among the most important civil liberties in a free society. With this project we empower you to exchange information over the internet in truly secure and private way. This product is made in a way that respects people's integrity and privacy all the way. We have no interest in you! Not in you as a person, nor in your secrets. Read more on our [Privacy page](/privacy).
`}
      />
    </Section>

    <Section title={'Security by Design'} subtitle={`True end-to-end encryption`}>
      <Markdown
        source={`
Your secret never leaves the browser unencrypted. That's the beauty of secret links - the link itself holds the encryption key that is necessary to decrypt your secret. Only with the link you will ever be able to retrieve the secret message and reveal the original content. After the first visit, the database entry gets deleted for good. Read more on our [Security page](/security).
![Link explanation](/images/link-explanation.svg)
`}
      />
    </Section>

    <Section title={'User Accounts'} subtitle={`On why we offer free and premium accounts.`}>
      <Markdown
        source={`
The main reason we offer accounts is to prevent spam and fraud. All core features are free of charge and don't require an account.

That said, some features do require basic authentication  (We just ask for an email address - we don't mind you using a temporary email address). These features include sending information via email or SMS. Accounts help us prevent abuse of the underlying systems. 

Paid premium accounts are meant for power users and people who like to [support this project](/pricing).
`}
      />
    </Section>

    <Section title={'Browser Extension'} subtitle={`Share secrets from within your browser.`}>
      <Markdown
        source={`
To make this service easy and convenient, there are browser extensions available for all modern browsers. All addons share the same security and privacy features.
- [Chrome](https://chrome.google.com/webstore/detail/scrtlink-share-a-secret/gkpenncdoafjgnphhnmoiocbfbojggip)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/scrt-link)
- Microsoft Edge (coming soon)
`}
      />
    </Section>

    {/* <Section title={'Credits'} subtitle={`This project would not have been possible without:`}>
      <Markdown
        source={`
- One time secret
- Yopass
- foo
`}
      />
    </Section> */}
  </Page>
)

export default About
