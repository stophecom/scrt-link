import React, { useCallback, useReducer, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { isServer } from '@/utils';
import { Formik, Form, FormikConfig } from 'formik';
import { Maybe, ShortUrlInput } from '@/types';
import BaseTextField from '@/components/BaseTextField';
import { ShortUrlData } from '@/api/models/ShortUrl';
import ExternalLink from '@/components/ExternalLink';
import ShareButtons from './components/ShareButtons';
import UrlQrCode from './components/UrlQrCode';
import { shortUrlInputValidationSchema } from '@/utils/validationSchemas';
import { Box, InputAdornment, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import BaseButton from '@/components/BaseButton';
import Spacer from '@/components/Spacer';
import Alert from '@material-ui/lab/Alert';
import { Bold } from '@/components/StyleUtils';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ShareIcon from '@material-ui/icons/FileCopyOutlined';
import { CopyToClipboard } from 'react-copy-to-clipboard';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!@svgr/webpack!@/assets/images/logo.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAxiosError(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError;
}

const qrCodeSize = 256;

type OnSubmit<FormValues> = FormikConfig<FormValues>['onSubmit'];

type UrlFormValues = ShortUrlInput;

const initialValues: UrlFormValues = {
  url: '',
  customAlias: '',
  message: '',
};

interface State {
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

  const { data } = state;
  const url = data?.url;
  const alias = data?.alias;
  const origin = isServer()
    ? process.env.NEXT_PUBLIC_BASE_URL
    : window.location.origin;
  const shortenedUrl = alias ? `${origin}/${alias}` : null;

  const { error } = state;

  const [hasCopied, setHasCopied] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);

  return (
    <>
      <Box flex={1} marginBottom={9} mt={5}>
        <Logo width="150px" height="150px" />
        <Typography variant="h1">Share a secret</Typography>

        <Typography variant="subtitle1">
          Create links that only work once!
        </Typography>
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
                  <BaseTextField
                    name="url"
                    label="URL"
                    required
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <BaseTextField name="message" label="Message" />
                  <BaseTextField
                    name="customAlias"
                    label="Custom Alias (Optional)"
                  />
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

      <Spacer flexDirection="column" spacing={2} marginY={1}>
        {(data || error) && (
          <Box marginY={2}>
            <Alert severity={error ? 'error' : 'success'}>
              {error || 'Your new URL has been created successfully!'}
            </Alert>
          </Box>
        )}
        {url && (
          <Box>
            <Typography noWrap>
              <Bold>Old URL:</Bold>{' '}
              <ExternalLink href={url} hasIcon>
                {url}
              </ExternalLink>
            </Typography>
          </Box>
        )}
        {shortenedUrl && (
          <Box>
            <Box display="flex" alignItems="center">
              <Typography noWrap>
                <Bold>New URL:</Bold>{' '}
                <ExternalLink href={shortenedUrl}>{shortenedUrl}</ExternalLink>
              </Typography>
              <Box marginLeft={1}>
                <CopyToClipboard
                  text={shortenedUrl}
                  onCopy={() => {
                    setHasCopied(true);
                    setTimeout(() => {
                      setHasCopied(false);
                    }, 2000);
                  }}
                >
                  <BaseButton
                    startIcon={<FileCopyOutlinedIcon />}
                    size="small"
                    variant="contained"
                  >
                    {hasCopied ? 'Copied' : 'Copy'}
                  </BaseButton>
                </CopyToClipboard>
                {isShareVisible || (
                  <BaseButton
                    startIcon={<ShareIcon />}
                    size="small"
                    variant="contained"
                    onClick={() => setIsShareVisible(true)}
                    ml={2}
                  >
                    Share
                  </BaseButton>
                )}
              </Box>
            </Box>
          </Box>
        )}
        {shortenedUrl && isShareVisible && (
          <Box maxWidth={qrCodeSize}>
            <Typography>
              <Bold>QR Code:</Bold>
            </Typography>
            <UrlQrCode url={shortenedUrl} size={qrCodeSize} />
            <ShareButtons url={shortenedUrl} />
          </Box>
        )}
      </Spacer>
    </>
  );
};

export default HomeView;
