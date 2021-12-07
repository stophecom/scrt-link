import React, { useState } from 'react'
import { Box } from '@material-ui/core'
import { Formik, Form, FormikConfig } from 'formik'
import NoSsr from '@material-ui/core/NoSsr'
import { useSession, signOut } from 'next-auth/client'
import { useTranslation } from 'next-i18next'
import Alert from '@material-ui/lab/Alert'

import { getAbsoluteLocalizedUrl } from '@/utils/localization'
import BaseSwitchField from '@/components/BaseSwitchField'
import { Maybe } from '@/types'
import BaseButton from '@/components/BaseButton'
import { deleteCustomerValidationSchema } from '@/utils/validationSchemas'
import { api } from '@/utils/api'

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit']

type ResponseDelete = Maybe<{ message: string }>

type State = {
  data?: ResponseDelete
  error?: string
}

type DeleteAccountProps = {
  isSure: boolean
}

const FormDeleteAccount = () => {
  const [session] = useSession()
  const [state, setState] = useState<State>({})
  const { t, i18n } = useTranslation()

  const handleSubmit: OnSubmit<DeleteAccountProps> = async (_values, formikHelpers) => {
    try {
      const response = await api<ResponseDelete>('/me', { method: 'DELETE' })
      setState({ data: response })
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : 'FormDeleteAccount submit failed.',
      })
    } finally {
      formikHelpers.setSubmitting(false)
      signOut({ callbackUrl: getAbsoluteLocalizedUrl('/', i18n.language) })
    }
  }

  const { data, error } = state

  if (!session) {
    return null
  }

  return (
    <>
      {(error || data?.message) && (
        <NoSsr>
          <Box mb={5}>
            {error && <Alert severity="error">{error}</Alert>}
            {data?.message && <Alert severity="success">{data.message}</Alert>}
          </Box>
        </NoSsr>
      )}

      <Formik<DeleteAccountProps>
        initialValues={{ isSure: false }}
        validationSchema={deleteCustomerValidationSchema(t)}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ isValid, isSubmitting }) => {
          return (
            <>
              <Form noValidate>
                <BaseSwitchField
                  label={t(
                    'common:components.FormDeleteAccount.label',
                    'I want to delete my account.',
                  )}
                  name="isSure"
                />

                <Box pt={5}>
                  <BaseButton
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    disabled={!isValid}
                  >
                    {t('common:button.deleteAccount', 'Delete Account')}
                  </BaseButton>
                </Box>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default FormDeleteAccount
