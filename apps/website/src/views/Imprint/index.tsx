import React from 'react'
import { Typography, Box } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import { Link } from '@/components/Link'
import Page from '@/components/Page'
import ExternalLink from '@/components/ExternalLink'

import { emailSantihans } from '@/constants'
import { policies, terms } from '@/data/menu'

const LinkStyled = styled(Link)`
  font-size: 1rem;
`
type MenuProps = { menu: { href: string; label: string }[] }
export const Menu: React.FunctionComponent<MenuProps> = ({ menu }) => (
  <Box component="ul">
    {menu.map(({ href, label }, index) => (
      <li key={index}>
        <LinkStyled href={href} color="primary">
          {label}
        </LinkStyled>
      </li>
    ))}
  </Box>
)

export const ImprintInfo = () => (
  <Typography component={'div'}>
    SANTiHANS GmbH
    <br />
    CH-4056 Basel <br />
    UID: CHE-244.875.499
    <br />
    <Link href={`mailto:${emailSantihans}`}>{emailSantihans}</Link>
  </Typography>
)

const Imprint = () => {
  const { t } = useTranslation()

  return (
    <Page
      title={t('common:views.Imprint.title', 'Imprint')}
      subtitle={t('common:views.Imprint.subtitle', `Tl;dr: Limited liability.`)}
    >
      <Box mb={4}>
        <ImprintInfo />
      </Box>
      <Box mb={4}>
        <Typography variant="h3">
          {t('common:views.Imprint.policiesAndTerms', 'Policies and Terms')}
        </Typography>
        <Menu menu={[...policies(t), ...terms(t)]} />
      </Box>
      <Box mb={4}>
        <Typography variant="h3">{t('common:views.Imprint.credits', 'Credits')}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant="body1" component={'div'}>
          {t(
            'common:views.Imprint.flowSwiss',
            'This project is supported by Flow Swiss AG - Premium cloud services from Zurich, Switzerland.',
          )}
          <br />〜<ExternalLink href="https://flow.swiss">flow.swiss</ExternalLink>
        </Typography>
      </Box>
      <Typography variant="body2">
        {t('common:views.Imprint.inspiration', 'Inspiration')}: PrivateBin, OneTimeSecret, Yopass,
        Saltify, hat.sh, OnURL
      </Typography>
    </Page>
  )
}

export default Imprint
