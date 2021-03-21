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
- All messages are stored encrypted using **AES-256**, using a 512 bit password hash.
- After a secret has been viewed, we delete it permanently from our database. There is no backup.
- If a password is provided, we use it to encrypt your secret **on the client** - in other words, there is no way of decrypting your message, since we don't even store a hash of your password. Even with the most advanced attacks (e.g. man in the middle attack) or **access to all our infrastructure** an attacker couldn't read your message.
- As little third-party code as possible. No Google, no Facebook, no cookies, no tracking.
- All code is open-source on [Gitlab](https://gitlab.com/kingchiller/scrt-link. Dependencies are updated regularly.
`}
        />
      </Typography>
    </Box>
    <Box mb={6}>
      <Typography variant="h3">Infrastructure</Typography>
      <Typography variant="h4">Trusted players, little dependencies.</Typography>

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
