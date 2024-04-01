import React from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

import { MarkdownStyled as Markdown } from '@/components/Markdown'
import Page from '@/components/Page'
import Section from '@/components/Section'
import { BaseButtonLink } from '@/components/Link'
import {
  chromeExtensionLink,
  firefoxExtensionLink,
  microsoftEdgeExtensionLink,
  slackAppInstallLink,
} from '@/constants'
import {
  npmScrtLinkCore,
  npmScrtLinkCli,
  repositoryLink,
  gitlabScrtLinkCore,
  gitlabScrtLinkSlack,
  gitlabScrtLinkCli,
} from '@/data/markdown'

const About = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.About.title', 'About')}
      subtitle={t(
        'common:views.About.subtitle',
        'The whole project is based on a simple premise: The less we know, the better.',
      )}
      intro={t(
        'common:views.About.intro',
        `It all started with the idea to send private messages in a fun way. Messages that don't persist. Think Snapchat, but without giving away your user data. The idea grew into a project that could be summarized as "Sharing secrets as a service". There are similar products out there - in fact, some have been a great inspiration. However, what sets scrt.link apart is the combination of all the great ideas and concepts around security and privacy, with the attention on design and user experience. Stay tuned - there is for more come!`,
      )}
    >
      <Section title={t('common:views.About.Philosophy.title', 'Philosophy')}>
        <Markdown
          source={t(
            'common:views.About.Philosophy.markdown',
            `Freedom of speech, freedom of the press, and the right to privacy are among the most important civil liberties in a free society. With this project we empower you to exchange information over the internet in truly secure and private way. This product is made in a way that respects people's integrity and privacy all the way. We have no interest in you! Not in you as a person, nor in your secrets. Read more on our [Privacy page](/privacy).`,
          )}
        />
      </Section>

      <Section
        title={t('common:views.About.Accounts.title', 'User Accounts')}
        subtitle={t(
          'common:views.About.Accounts.subtitle',
          `On why we offer free and premium accounts.`,
        )}
      >
        <Markdown
          source={t(
            'common:views.About.Accounts.markdown',
            `The main reason we offer accounts is to prevent spam and fraud. All core features are free of charge and don't require an account.

That said, some features do require basic authentication  (We just ask for an email address - we don't mind you using a temporary email address). These features include sending information via email. Accounts help us prevent abuse of the underlying systems. 

Paid premium accounts are meant for power users and people who like to [support this project](/pricing).`,
          )}
        />
      </Section>
      <Section
        title={t('common:views.About.BrowserExtensions.title', 'Browser Extensions')}
        subtitle={t(
          'common:views.About.BrowserExtensions.subtitle',
          `Share secrets from within your browser.`,
        )}
      >
        <Markdown
          source={`${t(
            'common:views.About.BrowserExtensions.markdown',
            'To make this service easy and convenient, there are browser extensions available for all modern browsers. All addons share the same security and privacy features.',
          )}
- [Google Chrome](${chromeExtensionLink})
- [Mozilla Firefox](${firefoxExtensionLink})
- [Microsoft Edge](${microsoftEdgeExtensionLink})`}
        />
      </Section>
      <Section
        title={t('common:views.About.SlackApp.title', 'Slack Application')}
        subtitle={t(
          'common:views.About.SlackApp.subtitle',
          `No more switching apps. With the Slack App you can create one-time secrets right within your Slack conversations.`,
        )}
      >
        <Box mb={3}>
          <Image width={210} height={62} src="/images/slack/Slack_RGB_White.svg" alt="Slack" />
        </Box>
        <BaseButtonLink variant="contained" href={slackAppInstallLink}>
          {t('common:button.installNow', 'Install now')}
        </BaseButtonLink>
        &nbsp;&nbsp;
        <BaseButtonLink variant="text" href="/slack">
          {t('common:button.learnMore', 'Learn more')}
        </BaseButtonLink>
      </Section>

      <Section
        title={t('common:views.About.Developers.title', 'For Developers')}
        subtitle={t(
          'common:views.About.Developers.subtitle',
          `All code is open source. You can use the following packages to create your own service, or to use our service programmatically via public API.`,
        )}
      >
        <Markdown
          source={t('common:views.About.Developers.markdown', {
            defaultValue: `With our developer tools you can easily integrate this service into your own projects. We offer a public API together with client-side packages that handle end-to-end-encryption.

### NPM Packages

- {{npmScrtLinkCore}} Use this package to create a secret link. This tools handles everything around encryption and API. (It's the same code that runs on this website.)
- {{npmScrtLinkCli}} Use this package to create secrets from the command line.

### Source Code

- {{gitlabScrtLink}} Source code of the API and this website.
- {{gitlabScrtLinkCore}} Source code of core package that handles encryption and API access.
- {{gitlabScrtLinkCli}} Source code of the CLI tool.
- {{gitlabScrtLinkSlack}} Source code of the Slack App.`,
            npmScrtLinkCore,
            npmScrtLinkCli,
            gitlabScrtLink: repositoryLink,
            gitlabScrtLinkCore,
            gitlabScrtLinkCli,
            gitlabScrtLinkSlack,
          })}
        />
      </Section>
    </Page>
  )
}

export default About
