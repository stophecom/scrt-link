import React, { useState } from 'react'
import { Box, NoSsr, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSession } from 'next-auth/client'
import { Face } from '@material-ui/icons'
import NextNprogress from 'nextjs-progressbar'
import { useTranslation } from 'next-i18next'

import BaseButton from '@/components/BaseButton'
import { Link, BaseButtonLink } from '@/components/Link'
import FormSignIn from '@/components/FormSignIn'
import { pink } from '@/theme'
import { appTitle } from '@/constants'
import SROnly from '@/components/ScreenreaderOnly'
import { useCustomer } from '@/utils/api'
import { getBaseURL } from '@/utils'

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg'

export const Container = styled.main`
  flex: 1;
  margin: 0 auto;
  max-width: 780px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)}px;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      width: '40px',
      height: '40px',
    },
  }),
)

type State = 'default' | 'signin' | 'signup'
const Layout: React.FC = ({ children }) => {
  const classes = useStyles()
  const { data: customer, isLoading } = useCustomer()
  const [session] = useSession()
  const [state, setState] = useState<State>('default')
  const { t } = useTranslation()

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <NextNprogress color={pink} options={{ showSpinner: false }} />
      <Container>
        <Box display="flex" alignItems="center" pb={2} mb={3}>
          <Link className="logo" href="/widget">
            {/* @ts-ignore */}
            <Logo className={classes.logo} />
            <SROnly>{appTitle}</SROnly>
          </Link>
          <Box ml="auto" display="flex" alignItems="center">
            <NoSsr>
              {session && !isLoading ? (
                <>
                  <BaseButtonLink
                    href="/account"
                    target="_blank"
                    color="primary"
                    variant="text"
                    size="small"
                  >
                    <Face fontSize="small" />
                    &nbsp;
                    <Typography
                      component="span"
                      variant="button"
                      style={{ maxWidth: '150px' }}
                      noWrap
                    >
                      {customer?.name || t('common:Widget.myAccount', 'My account')}
                    </Typography>
                  </BaseButtonLink>
                </>
              ) : ['signin', 'signup'].includes(state) ? (
                <BaseButton onClick={() => setState('default')} variant="text" size="small">
                  {t('common:button.cancel', 'Cancel')}
                </BaseButton>
              ) : (
                <>
                  <Box mr={1}>
                    <BaseButton onClick={() => setState('signin')} variant="text" size="small">
                      {t('common:button.signIn', 'Sign in')}
                    </BaseButton>
                  </Box>
                </>
              )}
            </NoSsr>
          </Box>
        </Box>
        {['signin', 'signup'].includes(state) ? (
          <>
            <FormSignIn
              callbackUrl={`${getBaseURL()}/widget/sign-in-success`}
              showSignUp={state === 'signup'}
            />
            {state !== 'signup' && (
              <Box display="flex" alignItems="center">
                {t('common:Widget.noAccountYet', 'No Account yet?')}&nbsp;
                <BaseButton onClick={() => setState('signup')} variant="text" size="small">
                  {t('common:button.signUp', 'Sign up')}
                </BaseButton>
              </Box>
            )}
          </>
        ) : (
          children
        )}
      </Container>
    </Box>
  )
}

export default Layout
