import React, { memo } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';

const FormFieldInner = memo(
  ({
    error,
    name,
    label,
    helperText,
    register,
    required,
    children,
    styleProps = {},
  }) => {
    const helperId = `${name}-helper-text`;
    const isError = Boolean(error);

    return (
      <FormControl
        mb={4}
        isRequired={required}
        isInvalid={isError}
        width="100%"
        maxWidth="310px"
        {...styleProps.formControl}
      >
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
        {children({ register, name })}
        {!isError && helperText && (
          <FormHelperText
            id={helperId}
            maxWidth="20rem"
            {...styleProps.helperText}
          >
            {helperText}
          </FormHelperText>
        )}
        {isError && (
          <FormErrorMessage maxWidth="20rem" {...styleProps.helperText}>
            {error.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  },
);

const FormField = ({ name, ...rest }) => {
  const { errors, register } = useFormContext();
  const error = errors[name];
  return <FormFieldInner error={error} register={register} {...rest} />;
};

export default FormField;
