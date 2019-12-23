import React, { useCallback, useState, useEffect } from 'react';
import { Box } from '@chakra-ui/core';
import { FormContext } from 'react-hook-form';

const Form = ({
  onSubmit,
  children,
  className,
  methods,
  defaultValues,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { handleSubmit } = methods;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const runSubmit = useCallback(
    async (event) => {
      try {
        setIsLoading(true);
        await onSubmit(event);
        if (isMounted) setIsLoading(false);
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    },
    [onSubmit, isMounted],
  );

  return (
    <FormContext {...methods} defaultValues={defaultValues}>
      <Box
        as="form"
        css={{
          opacity: 1,
          transition: `transform 0.2s ease-in-out`,
          ...(isLoading
            ? {
                opacity: 0.6,
                pointerEvents: 'none',
              }
            : null),
        }}
        noValidate
        onSubmit={handleSubmit(runSubmit)}
        {...rest}
      >
        {children}
      </Box>
    </FormContext>
  );
};

export default Form;
