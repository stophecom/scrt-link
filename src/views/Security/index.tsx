import React from 'react'
import Markdown from '@/components/Markdown'

import Page from '@/components/Page'
import Section from '@/components/Section'

const Security = () => (
  <Page
    title="Security"
    subtitle={`Best practices, no extras.`}
    intro={
      <Markdown
        source={`
All messages are **end-to-end encrypted**. We generate a random hash to encrypt your secret **on the client** using **AES-256** (Advanced Encryption Standard). The encryption key is never stored, but added to the secret link itself. Without the full link, nobody (including us) will ever be able to decrypt your message. 

If a password is provided, we use it to encrypt your secret **on top** of the standard encryption. The password is not being stored. Even with the most advanced attacks (e.g. man in the middle attack) and **access to all our infrastructure** an attacker couldn't read your message. After a secret has been viewed, we delete it permanently from our database. There is no backup.
![Link explanation](/images/link-explanation.svg)

### Security by design
- All connections are secured via HTTPS
- All data is stored encrypted (not only secrets)
- As little third-party code as possible
- Dependencies are checked and updated regularly
- All code is open-source on [Gitlab](https://gitlab.com/kingchiller/scrt-link)
`}
      />
    }
  >
    <Section title={'Infrastructure'} subtitle={`Trusted players, few dependencies.`}>
      <Markdown
        source={`
We chose industry leaders to host our infrastructure:

- Website/API on [Vercel](https://vercel.com)
- Cloud Database on [MongoDB](https://cloud.mongodb.com)
- All code on [Gitlab](https://gitlab.com/kingchiller/scrt-link)
`}
      />
    </Section>
  </Page>
)

export default Security
