import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Box } from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useTranslation } from 'next-i18next'

import Markdown from '@/components/Markdown'
import Page from '@/components/Page'
import Section from '@/components/Section'
import BoxShadowWrapper from '@/components/BoxShadowWrapper'
import { slackAppInstallLink } from '@/constants'
import slackAppFaq from '@/data/faq/slack'

const FaqAccordion = dynamic(() => import('@/components/Accordion'))

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slackButton: {
      '& .slack-button': {
        transform: 'scale(0.8)',
      },

      [theme.breakpoints.up('sm')]: {
        '& .slack-button': {
          transform: 'scale(1)',
        },
      },
    },
    screenshot: {
      '& > .image ': {
        transform: 'translateY(0)',
        transition: '700ms',
      },

      '&.image--in-view > .image ': {
        transform: 'translateY(-15px)',
      },
    },
    cta: {
      backgroundColor: theme.palette.background.default,
      position: 'absolute',
      bottom: -50,
      paddingTop: '16px',
      paddingBottom: '40px',
      width: '100vw',
      left: '50%',
      transform: 'translateX(-50%)',
      boxShadow: '0 -12px 10px -10px #00000047, 0 -35px 20px -30px #00000027',
      maxWidth: theme.breakpoints.values.md,
      zIndex: 1,

      [theme.breakpoints.up('sm')]: {
        paddingTop: '46px',
        paddingBottom: '60px',
      },
    },
    shadow: {
      display: 'inline-flex',
      borderRadius: '10px',
      boxShadow:
        '0 0 50px rgba(255, 0, 131, 0.4), 0px 0px 20px rgba(255, 0, 131, 0.3), 0 0 2px rgba(255, 0, 131, 1)',
      transition: '400ms',

      '&:hover': {
        boxShadow:
          '0 0 70px rgba(255, 0, 131, 0.5), 0px 0px 25px rgba(255, 0, 131, 0.3), 0 0 3px rgba(255, 0, 131, 1)',
      },
    },
    image: {
      display: 'block !important',
    },
  }),
)

type SlackInstallButtonProps = {
  className?: string
}
const SlackInstallButton: React.FC<SlackInstallButtonProps> = ({ className }) => {
  const classes = useStyles()

  return (
    <Box
      className={clsx(classes.slackButton, className)}
      display="flex"
      justifyContent="center"
      py={3}
    >
      <a className={clsx(classes.shadow, 'slack-button')} href={slackAppInstallLink}>
        <Image
          className={classes.image}
          width={1.3 * 140}
          height={1.3 * 41}
          src="/images/slack/btn-add-to-slack.svg"
          alt="Add to Slack"
        />
      </a>
    </Box>
  )
}

const Slack = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Page
      title="The Slack App"
      subtitle={`Some things better not stay in your chat history.`}
      intro={
        'Slack conversations are never fully private. Did you know that a systems administrator or your boss could potentially read your Slack messages? With the scrt.link App you can now protect sensitive information within your Slack conversation.'
      }
    >
      <Box position="relative">
        <BoxShadowWrapper className={classes.screenshot}>
          <Image
            className={classes.image}
            src="/images/slack/slack-screenshot-command.png"
            alt="Screenshot"
            width={1926}
            height={792}
            objectFit="cover"
            objectPosition="top"
          />
        </BoxShadowWrapper>
        <SlackInstallButton className={classes.cta} />
      </Box>

      <Section
        title={'Secrets for Slack'}
        subtitle="It's a very common scenario: A coworker asks you for some access token, API key or password. Now, you can safely respond."
      >
        <Markdown
          source={`
### Key Features
- Create one-time secrets via **shortcut** or **slash command**.
- **Encrypted, disposable messages** that are stored outside of Slack.
- **Burn notification** after a secret has been viewed. 
- No logs, no backup, no trace.
    
  👉 [Install now](${slackAppInstallLink})
---
#### _Important information about security limitations_
_Due to the nature of
how Slack apps are designed, full **end-to-end encryption is not possible**. We take a number of steps to make sure your secrets are safe, including encrypted connections, sandboxed application server, limited access to infrastructure, etc. In 99% of use cases this is
fine and a risk worth taking - still, Slack is proprietary software where we don't have control over. In other words, if you need advanced protection, create secrets
on the website instead._
`}
        />
      </Section>

      <Section title={'How to use'} subtitle="">
        <Markdown
          source={`
### Slash Command 
The easiest and most versatile option is to use a slash command (**\`/scrt\`**)

_Example:_
![Image](/images/slack/slack-screenshot-command-input.png)

- **\`/scrt\`** opens a dialog to create a secret.
- **\`/scrt\` _\`[secret goes here…]\`_** creates a secret link instantly (of type **Text**).
- **\`/scrt [text|link|neogram]\`** opens a dialog to create a specific type of secret.
- **\`/scrt help\`**: opens a help dialog.

### Slack Shortcuts
There are global and message level shortcuts available.
- Click ⚡️ to access global shortcuts and choose **scrt.link**.
- Within a conversation, click the context menu icon (3 dots) and choose **Reply with a secret**.

![Image](/images/slack/slack-screenshot-shortcut-detail.png)

### Read Receipts
This is a built in feature. You get notified when a secret has been viewed. We use a 🔥 emoji to indicate when a secret has been burned and the link is therefore no longer available.
![Image](/images/slack/slack-screenshot-read-receipt.png)
`}
        />
      </Section>

      <Section title={'FAQ'} subtitle="Frequently asked questions about the Slack App.">
        <FaqAccordion items={slackAppFaq(t)} />
      </Section>
      <SlackInstallButton />
    </Page>
  )
}

export default Slack
