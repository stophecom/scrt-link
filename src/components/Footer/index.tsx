import React from 'react'
import { Box, IconButton } from '@mui/material'
import { Twitter } from '@mui/icons-material'
import { useTranslation, Trans } from 'next-i18next'
import { styled } from '@mui/system'

import { LanguageSelector } from '@/components/LanguageSwitcher'
import { Link } from '@/components/Link'
import { twitterLink, twitterHandle } from '@/constants'
import Stats from '@/components/Stats'
import { Container } from '@/layouts/Default'
import { main, about } from '@/data/menu'

const StyledBox = styled(Box)`
  font-size: 0.85em;
  opacity: 0.8;
  background: ${({ theme }) => theme.palette.background.paper};
  box-shadow: inset 0 10px 40px hsl(0deg 0% 0% / 20%);

  & .link-padding {
    padding: ${({ theme }) => theme.spacing(1)};
  }
`

const LinkStyled = styled(Link)`
  font-size: 1.2rem;
`

const Legal = styled('div')`
  opacity: 0.7;
  text-align: center;
`

const LinkAbout = styled(Link)`
  text-decoration: underline;
`
const Bullet = styled('span')`
  color: ${({ theme }) => theme.palette.success.main};
  padding-left: 5px;
`

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <StyledBox component="footer">
      <Container>
        <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
          {main(t).map(({ href, label, prefetch }, index) => (
            <LinkStyled
              key={index}
              href={href}
              prefetch={prefetch}
              className="link-padding"
              color="primary"
            >
              {label}
            </LinkStyled>
          ))}
        </Box>
        <Box key="stats1" display="flex" flexWrap="wrap" justifyContent="center" p={2} pt={0}>
          <Stats />
        </Box>
        <Box display="flex" justifyContent="center">
          <IconButton
            target="_blank"
            href={twitterLink}
            aria-label={twitterHandle}
            title={twitterHandle}
            size="large"
          >
            <Twitter fontSize="inherit" />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
          <Legal>
            <Trans i18nKey="common:components.Footer.abstract">
              <strong>Scrt.link</strong> lets you share sensitive information online. End-to-end
              encrypted. One time.
              <br />
              Keep confidential information out of email, Slack, Teams, Whatsapp or any other
              communication channel. A one-time disposable link guarantees your secrets can only
              ever be accessed once - before being destroyed forever.
            </Trans>
            <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
              <span className="link-padding">©{new Date().getFullYear()} SANTiHANS GmbH</span>

              {about(t).map(({ href, label }, index) => (
                <LinkAbout key={index} href={href} className="link-padding" color="inherit">
                  {label}
                </LinkAbout>
              ))}
              <span className="link-padding">
                <LinkAbout
                  href={'https://stats.uptimerobot.com/v5yqDuEr5z'}
                  target="_blank"
                  rel="noreferrer"
                  color="inherit"
                >
                  {t('common:menu.status', 'Status')}
                </LinkAbout>
                <Bullet>●</Bullet>
              </span>
              <LanguageSelector />
            </Box>
          </Legal>
        </Box>
      </Container>
    </StyledBox>
  )
}

export default Footer
