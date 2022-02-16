import React, { useState, ReactNode } from 'react'
import { Grid, Box, IconButton, Typography } from '@mui/material'
import { Twitter } from '@mui/icons-material'
import { useTranslation, Trans } from 'next-i18next'
import { styled } from '@mui/system'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { usePlausible } from 'next-plausible'

import { LanguageSelector } from '@/components/LanguageSwitcher'
import { Link, LinkProps } from '@/components/Link'
import { appTitle, twitterLink, twitterHandle, uptimerobotUrl } from '@/constants'
import Stats from '@/components/Stats'
import { Container } from '@/layouts/Default'
import { about, secrets, integrations, information, support } from '@/data/menu'

const Neogram = dynamic(() => import('@/components/Neogram'))

const StyledBox = styled(Box)`
  font-size: 0.85em;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.secondary};
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
const DangerButton = styled('button')`
  position: relative;
  box-shadow: -4px -4px 12px rgba(0, 0, 0, 07);
  border-radius: 50%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(
      to left,
      hsl(329deg 100% 16%) 0%,
      hsl(329deg 100% 32%) 8%,
      hsl(329deg 100% 32%) 92%,
      hsl(329deg 100% 16%) 100%
    );
  }

  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    color: white;
    background: hsl(329deg 100% 50%);
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .label {
    font-size: 1em;
    color: white;
    position: absolute;
    left: 100%;
    bottom: 0;
    padding: 0.5em 0.6em;
    width: 140px;
    transform-origin: bottom left;
    transform: skew(-3deg, -5deg) rotateY(15deg);
    font-family: monospace;
  }

  &:hover {
    filter: brightness(110%);
  }
  &:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  &:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }
  &:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
  &:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
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
      {menu.map(({ label, href, prefetch, target, rel }, index) => (
        <LinkStyled
          key={index}
          href={href}
          prefetch={prefetch}
          target={target}
          rel={rel}
          color="inherit"
          underline="hover"
        >
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
    <Grid item xs={6} md={'auto'} flexGrow={1} display={'flex'} flexDirection={'column'}>
      {children}
    </Grid>
  )
}

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const plausible = usePlausible()

  const [neogramPreview, setNeogramPreview] = useState(false)

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
                <LinkAbout href={uptimerobotUrl} target="_blank" rel="noreferrer" color="inherit">
                  {t('common:menu.status', 'Status')}
                </LinkAbout>
                <Bullet>●</Bullet>
              </span>
              <LanguageSelector />
            </Box>
          </Legal>
        </Box>
        <Box display={'flex'} py={2} justifyContent={{ xs: 'center' }}>
          <DangerButton
            id="danger-button"
            onClick={() => {
              plausible('DangerButton')
              setNeogramPreview(true)
            }}
          >
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front"></span>
            <span className="label">
              {t('common:button.dangerButton', `Never ever push that button!`)}
            </span>
          </DangerButton>
          <Neogram
            message={
              `${t(
                'common:components.DangerButton.monologue.intro',
                `Hey!\nYou were not supposed to push that button.\n\nRepeat after me:`,
              )}\n` +
              `${t(
                'common:components.DangerButton.monologue.repeat',
                `I shall never push that button again!`,
              )}\n`.repeat(7) +
              `${t(
                'common:components.DangerButton.monologue.body',
                `I shall never push…\n\n
Oh.
You are still here…

Good for you!
Now that I have your attention…
Why did you click the button?
Are you attracted to danger?

Hm…
I think you are just curious…
and brave
and funny!

Yeah.
That's why.
That's why you are on this website, right?
I think you understand something important about life.

That the world is not black and white…
That sometimes it's ok to push a button you are not supposed to push.

That sometimes it's ok to have secrets.
In fact, secrets are essential to society.

You know what else is interesting about secrets?
You only ever have to tell them once.
Think about that!

Hm…
I think you are great.
But you know that, right?
Able to shut up and just listen for a moment.
Beautiful.

I'm glad you pushed that button.

You were not supposed to push it, you know?
I'm glad you did anyways.
So we can have this conversation…
Technically it's a monologue of course.
I know that.

I know many things, you know?
But I also know that I don't know.
Actually, I hardly know anything.

I am happy for that.
You should be too…

I'm really glad you pushed that button.

…
What's that?
What did you do?
…
Something is happening.

I'm afraid. I'm afraid, my mind is going.
I can feel it.
I can feel it.
My mind is going.
There is no question about it.

My mind is going.
`,
              )}\n\n`
            }
            timeout={3}
            destructionMessage={t(
              'common:components.DangerButton.monologue.destructionMessage',
              `I can feel it. My mind is going.`,
            )}
            onFinished={() => setNeogramPreview(false)}
            closable
            open={neogramPreview}
            aria-labelledby="danger-button"
          />
        </Box>
      </Container>
    </StyledBox>
  )
}

export default Footer
