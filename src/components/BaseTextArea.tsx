import React, { useEffect, useRef } from 'react';
import { TextareaAutosize, TextareaAutosizeProps } from '@material-ui/core';
import { useField, FieldHookConfig } from 'formik';

export type BaseTextAreaProps = TextareaAutosizeProps &
  FieldHookConfig<TextareaAutosizeProps['value']>;

function BaseTextField(props: BaseTextAreaProps) {
  const [field, meta] = useField(props);
  const { error, touched } = meta;
  const hasError = Boolean(error && touched);
  const errorMessage = hasError ? error : undefined;

  const inputRef = useRef<HTMLInputElement>();

  const { autoFocus } = props;

  // To make autoFocus work with Next.js
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  return (
    <TextareaAutosize
      {...{ ...props, ...field, variant: props.variant ?? 'outlined' }}
      inputRef={inputRef}
      // To be able to set the value as "undefined"
      // or "null" in Formik etc
      value={field.value ?? ''}
      fullWidth
      error={hasError}
      helperText={errorMessage}
    />
  );
}

export default BaseTextField;
