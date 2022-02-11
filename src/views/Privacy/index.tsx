import React from 'react'
import { Box } from '@mui/material'
import { useTranslation } from 'next-i18next'

import Markdown from '@/components/Markdown'
import { BaseButtonLink } from '@/components/Link'
import Page from '@/components/Page'
import Section from '@/components/Section'

const Privacy = () => {
  const { t } = useTranslation()
  return (
    <Page
      title={t('common:views.Privacy.title', 'Privacy')}
      subtitle={t('common:views.Privacy.subtitle', `No ads, no tracking, no bullshit.`)}
      intro={t(
        'common:views.Privacy.intro',
        "For us, privacy is not negotiable. We carefully choose and limit our tools in order to protect everyone's right to privacy. We don't use ads, we don't track individuals, we don't sell data and we keep personal data requirements at the bare minimum. Even with an account, we'd never ask for personally identifiable information (PII) without a good reason. On top of that, we use privacy by design principles: We structured our database in a way that a single secret remains a completely independent entity - even while using a user account, a secret can never be traced back to you.",
      )}
    >
      <Section title={t('common:views.Privacy.Analytics.title', 'Analytics')}>
        <Markdown
          source={t('common:views.Privacy.Analytics.markdown', {
            defaultValue: `We do basic web traffic analytics with {{linkPlausible}} -  the simple and privacy-friendly alternative to Google Analytics.

- No use of cookies
- Fully compliant with privacy regulations GDPR, CCPA and PECR
- No collection of personal data
- The project is open source
- All analytics data is **publicly available**: {{linkDashboard}}`,
            linkPlausible: '[Plausible.io](https://plausible.io/)',
            linkDashboard: '[Analytics Dashboard](https://plausible.io/scrt.link)',
          })}
        />
      </Section>

      <Section title={t('common:views.Privacy.Account.title', 'Account & Cookies')}>
        <Box mb={3}>
          <Markdown
            source={t('common:views.Privacy.Account.markdown', {
              defaultValue: `For power users, we offer user accounts that require authentication. You can create an account with only an email address (You may use a temporary or masked email) - no further information is mandatory. 

For people visiting our website, we only ever use essential cookies. In other words, cookies that are necessary for providing core functionalities: E.g. managing secure authentication. Read more in our Privacy Policy.`,
            })}
          />
        </Box>
        <BaseButtonLink href="/privacy-policy" variant="outlined">
          {t('common:button.privacyPolicy', 'Privacy Policy')}
        </BaseButtonLink>
      </Section>
    </Page>
  )
}

export default Privacy
