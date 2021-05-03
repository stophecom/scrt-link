import React from 'react'
import { Typography, Box } from '@material-ui/core'
import Markdown from '@/components/Markdown'

import Page from '@/components/Page'

const Security = () => (
  <Page
    title="Security"
    subtitle={`The whole project is based on a simple premise: The less we know, the better.`}
  >
    <Box mb={6}>
      <Typography variant="h3">Security by design</Typography>
      <Typography variant="h4">Best practices, no extras.</Typography>
      <Typography variant="body1">
        <Markdown
          source={`
- All messages are **end-to-end encrypted**. We generate a random hash to encrypt your secret **on the client** using **AES-256** (Advanced Encryption Standard). The encryption key is never stored, but added to the secret link itself. Without the full link, nobody (including us) will ever be able to decrypt your message. 
![Link explanation](/images/link-explanation.svg)
- If a password is provided, we use it to encrypt your secret **on top** of the standard encryption. The password is not being stored. Even with the most advanced attacks (e.g. man in the middle attack) and **access to all our infrastructure** an attacker couldn't read your message.
- After a secret has been viewed, we delete it permanently from our database. There is no backup.
- As little third-party code as possible. No Google, no Facebook, no tracking.
- All code is open-source on [Gitlab](https://gitlab.com/kingchiller/scrt-link). Dependencies are updated regularly.
`}
        />
      </Typography>
    </Box>
    <Box mb={6}>
      <Typography variant="h3">Infrastructure</Typography>
      <Typography variant="h4">Trusted players, few dependencies.</Typography>

      <Markdown
        source={`
We chose industry leaders to host our infrastructure:

- Website/API on [Vercel](https://vercel.com)
- Cloud Database on [MongoDB](https://cloud.mongodb.com)
- All code on [Gitlab](https://gitlab.com/kingchiller/scrt-link)
`}
      />
    </Box>
  </Page>
)

export default Security
