import React from 'react'
import { useTranslation } from 'next-i18next'

import { MarkdownStyled as Markdown } from '@/components/Markdown'
import Page from '@/components/Page'
import Section from '@/components/Section'

const Security = () => {
  const { t, i18n } = useTranslation()

  return (
    <Page
      title={t('common:views.Security.title', 'Security')}
      subtitle={t('common:views.Security.subtitle', `Best practices, no extras.`)}
      intro={t('common:views.Security.markdown', {
        defaultValue: `All messages are **end-to-end encrypted**. We generate a random hash to encrypt your secret **on the client** using **AES-256** (Advanced Encryption Standard). The encryption key is never stored, but added to the secret link itself. Without the full link, nobody (including us) will ever be able to decrypt your message. 

If a password is provided, we use it to encrypt your secret **on top** of the standard encryption. The password is not being stored. Even with the most advanced attacks (e.g. man in the middle attack) and **access to all our infrastructure** an attacker couldn't read your message. After a secret has been viewed, we delete it permanently from our database. There is no backup.
{{illustration}}

### Security by design
- All connections are secured via HTTPS
- All data is stored encrypted (not only secrets)
- As little third-party code as possible
- Dependencies are checked and updated regularly
- All code is open-source on {{gitlabLink}}`,
        gitlabLink: '[Gitlab](https://gitlab.com/kingchiller/scrt-link)',
        illustration: `![Illustration](/images/localized/${i18n.language}/link-explanation.svg)`,
      })}
    >
      <Section
        title={t('common:views.Security.Infrastructure.title', 'Infrastructure')}
        subtitle={t(
          'common:views.Security.Infrastructure.subtitle',
          `Trusted players, few dependencies.`,
        )}
      >
        <Markdown
          source={t('common:views.Security.Infrastructure.markdown', {
            defaultValue: `We chose industry leaders to host our infrastructure:

- Website/API on {{linkVercel}}
- Cloud Database with {{linkScaleGrid}}
- Object Storage (Files) with {{linkFlowSwiss}}
- Slack App on {{linkHeroku}}
- All code on {{linkGitlab}}`,
            linkVercel: '[Vercel](https://vercel.com)',
            linkScaleGrid: '[Scalegrid](https://scalegrid.io/)',
            linkFlowSwiss: '[Flow Swiss AG](https://flow.swiss/)',
            linkHeroku: '[Heroku](https://heroku.com/)',
            linkGitlab: '[Gitlab](https://gitlab.com/kingchiller/scrt-link)',
          })}
        />
      </Section>
    </Page>
  )
}

export default Security
