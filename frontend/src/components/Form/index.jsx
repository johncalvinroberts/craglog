import React, { useCallback, useState, forwardRef } from 'react';
import { Box } from '@chakra-ui/core';
import { FormContext } from 'react-hook-form';
import { useMounted } from '../../hooks';

export { default as SelectField } from './SelectField';
export { default as SliderField } from './SliderField';
export { default as TextField } from './TextField';
export { default as TextAreaField } from './TextAreaField';
export { default as FormField } from './FormField';
export { default as PasswordField } from './PasswordField';

const Form = forwardRef((props, ref) => {
  const {
    onSubmit,
    children,
    className,
    methods,
    defaultValues,
    ...rest
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const isMountedRef = useMounted();

  const { handleSubmit } = methods;

  const runSubmit = useCallback(
    async (event) => {
      try {
        setIsLoading(true);
        await onSubmit(event);
        if (isMountedRef.current) setIsLoading(false);
      } catch (error) {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [isMountedRef, onSubmit],
  );

  return (
    <FormContext {...methods} defaultValues={defaultValues}>
      <Box
        as="form"
        opacity="1"
        transition="opacity 0.2s ease-in-out"
        noValidate
        onSubmit={handleSubmit(runSubmit)}
        ref={ref}
        {...(isLoading
          ? {
              opacity: 0.6,
              pointerEvents: 'none',
            }
          : null)}
        {...rest}
      >
        {children}
      </Box>
    </FormContext>
  );
});

export default Form;
