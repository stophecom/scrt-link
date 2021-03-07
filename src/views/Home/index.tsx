import React, { Fragment, useCallback, useReducer } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

import { Box, InputAdornment, Typography } from '@material-ui/core';
import { Formik, Form, FormikConfig } from 'formik';

import { ShortUrlData } from '@/api/models/ShortUrl';
import BaseTextField from '@/components/BaseTextField';
import { Maybe, ShortUrlInput } from '@/types';

import TabsMenu from './components/TabsMenu';
import Result from './components/Result';
import { shortUrlInputValidationSchema } from '@/utils/validationSchemas';
import LinkIcon from '@material-ui/icons/Link';
import BaseButton from '@/components/BaseButton';
import Spacer from '@/components/Spacer';

// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError;
}

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit'];

type UrlFormValues = ShortUrlInput;

const initialValues: UrlFormValues = {
  url: '',
  customAlias: '',
  message: '',
};

export interface State {
  data: Maybe<ShortUrlData>;
  error: Maybe<string>;
}

type Action =
  | { type: 'request' }
  | { type: 'success'; response: AxiosResponse }
  | { type: 'error'; error: AxiosError | Error };

const doRequest = (): Action => ({
  type: 'request',
});

const doSuccess = (response: AxiosResponse): Action => ({
  type: 'success',
  response,
});

const doError = (error: AxiosError | Error): Action => ({
  type: 'error',
  error,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request':
      return { ...state, data: undefined, error: undefined };
    case 'success':
      return { ...state, data: action.response.data };
    case 'error':
      const { error } = action;
      let errorMessage = error.message;
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message ?? errorMessage;
      }
      return {
        ...state,
        error: errorMessage,
      };
    default:
      throw new Error();
  }
};

const initialState: State = {
  data: undefined,
  error: undefined,
};

const HomeView = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = useCallback<OnSubmit<UrlFormValues>>(
    async (values, formikHelpers) => {
      dispatch(doRequest());
      try {
        const response = await axios.post('/api/shorturl', values);
        dispatch(doSuccess(response));
        formikHelpers.resetForm();
      } catch (error) {
        dispatch(doError(error));
      } finally {
        formikHelpers.setSubmitting(false);
      }
    },
    [],
  );

  const { data, error } = state;

  const [secretType, setSecretType] = React.useState('message');

  const handleMenuChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: string,
  ) => {
    setSecretType(newValue);
  };

  return (
    <>
      <Box flex={1} marginBottom={9} mt={5}>
        <Logo width="150px" height="150px" />
        <Typography variant="h1">Share a secret</Typography>

        <Typography variant="subtitle1">
          Create a secret link that only works once.
        </Typography>
      </Box>

      {data || error ? (
        <Result data={data} error={error} />
      ) : (
        <Fragment>
          <Box mb={4}>
            <TabsMenu handleChange={handleMenuChange} value={secretType} />
          </Box>
          <Formik<UrlFormValues>
            initialValues={initialValues}
            validationSchema={shortUrlInputValidationSchema}
            validateOnMount
            onSubmit={handleSubmit}
          >
            {({ isValid, isSubmitting }) => {
              return (
                <>
                  <Form noValidate>
                    <Spacer flexDirection="column" spacing={2}>
                      {secretType === 'url' && (
                        <Fragment>
                          <BaseTextField
                            name="url"
                            label="URL"
                            autoFocus
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LinkIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <BaseTextField
                            name="customAlias"
                            label="Custom Alias (Optional)"
                          />
                        </Fragment>
                      )}
                      {secretType === 'message' && (
                        <BaseTextField
                          name="message"
                          multiline
                          rows={3}
                          rowsMax={7}
                          label="Message"
                          placeholder="Your secret message…"
                        />
                      )}

                      {secretType === 'password' && (
                        <BaseTextField name="message" label="Password" />
                      )}

                      <Box display="flex" justifyContent="flex-end">
                        <BaseButton
                          type="submit"
                          color="primary"
                          variant="contained"
                          loading={isSubmitting}
                          disabled={!isValid}
                        >
                          Submit
                        </BaseButton>
                      </Box>
                    </Spacer>
                  </Form>
                </>
              );
            }}
          </Formik>
        </Fragment>
      )}
    </>
  );
};

export default HomeView;
