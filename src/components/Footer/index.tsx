import React, { ReactNode } from 'react'
import { Grid, Box, IconButton, Typography } from '@mui/material'
import { Twitter } from '@mui/icons-material'
import { useTranslation, Trans } from 'next-i18next'
import { styled } from '@mui/system'
import Image from 'next/image'

import { LanguageSelector } from '@/components/LanguageSwitcher'
import { Link, LinkProps } from '@/components/Link'
import { appTitle, twitterLink, twitterHandle, uptimerobotUrl } from '@/constants'
import Stats from '@/components/Stats'
import { Container } from '@/layouts/Default'
import { about, secrets, integrations, information, support } from '@/data/menu'

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
  font-size: 1rem;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
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

interface CustomLink extends LinkProps {
  label: string
}
type SubMenuProps = {
  menu: CustomLink[]
  title: string
}
const SubMenu: React.FC<SubMenuProps> = ({ title, menu }) => {
  return (
    <>
      <Typography fontWeight={'bold'} mb={1} pt={3} color="primary">
        {title}
      </Typography>
      {menu.map(({ href, label, prefetch }, index) => (
        <LinkStyled key={index} href={href} prefetch={prefetch} color="inherit" underline="hover">
          {label}
        </LinkStyled>
      ))}
    </>
  )
}

type MenuBlockProps = {
  children: ReactNode
}
const GridBlock: React.FC<MenuBlockProps> = ({ children }) => {
  return (
    <Grid item xs={12} sm={6} md={'auto'} flexGrow={1} display={'flex'} flexDirection={'column'}>
      {children}
    </Grid>
  )
}

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <StyledBox component="footer">
      <Container>
        <Grid container spacing={2} justifyContent="space-between" mb={5}>
          <Grid item xs={12} sm={12} md={'auto'} display={'flex'} flexDirection={'column'}>
            <Link
              href="/"
              mb={3}
              pt={2}
              display={'flex'}
              alignItems={'center'}
              underline="none"
              color="inherit"
            >
              <Image src="/logo-transparent.svg" width={40} height={40} alt={appTitle} />
              <Typography ml={1} fontWeight={'bold'}>
                {appTitle}
              </Typography>
            </Link>
          </Grid>
          <GridBlock>
            <SubMenu menu={secrets(t)} title={t('common:menu.title.secrets', 'Secrets')} />
          </GridBlock>
          <GridBlock>
            <SubMenu
              menu={integrations}
              title={t('common:menu.title.integrations', 'Integrations')}
            />
          </GridBlock>
          <GridBlock>
            <SubMenu
              menu={information(t)}
              title={t('common:menu.title.information', 'Information')}
            />
          </GridBlock>
          <GridBlock>
            <SubMenu menu={support(t)} title={t('common:menu.title.support', 'Support')} />
          </GridBlock>
        </Grid>

        <Box display="flex" flexWrap="wrap" justifyContent="center" p={2}>
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
