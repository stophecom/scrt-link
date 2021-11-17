import React from 'react'
import { Box, IconButton } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { Twitter } from '@material-ui/icons'
import { useTranslation, Trans } from 'next-i18next'

import { Link } from '@/components/Link'
import { twitterLink, twitterHandle } from '@/constants'
import Stats from '@/components/Stats'
import { Container } from '@/layouts/Default'
import { main, about } from '@/data/menu'

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
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkPadding: {
      padding: theme.spacing(1),
    },
    footer: {
      opacity: 0.8,
      background: theme.palette.background.paper,
      boxShadow: `inset 0 10px 40px hsl(0deg 0% 0% / 20%)`,
    },
  }),
)

const Footer: React.FC = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box component="footer" className={classes.footer}>
      <Container>
        <Box display="flex" justifyContent="center" flexWrap="wrap" p={2}>
          {main(t).map(({ href, label, prefetch }, index) => (
            <LinkStyled
              key={index}
              href={href}
              prefetch={prefetch}
              className={classes.linkPadding}
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
              <span className={classes.linkPadding}>
                ©{new Date().getFullYear()} SANTiHANS GmbH
              </span>
              {about(t).map(({ href, label }, index) => (
                <LinkAbout key={index} href={href} className={classes.linkPadding} color="inherit">
                  {label}
                </LinkAbout>
              ))}
            </Box>
          </Legal>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
