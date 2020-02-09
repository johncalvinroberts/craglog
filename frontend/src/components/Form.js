import React, { useCallback, useState, forwardRef } from 'react';
import { Box } from '@chakra-ui/core';
import { FormContext } from 'react-hook-form';
import useMounted from '../hooks/useMounted';

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
        css={{
          opacity: 1,
          transition: `opacity 0.2s ease-in-out`,
          ...(isLoading
            ? {
                opacity: 0.6,
                pointerEvents: 'none',
              }
            : null),
        }}
        noValidate
        onSubmit={handleSubmit(runSubmit)}
        ref={ref}
        {...rest}
      >
        {children}
      </Box>
    </FormContext>
  );
});

export default Form;
