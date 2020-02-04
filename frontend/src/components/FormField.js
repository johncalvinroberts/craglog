import React, { memo } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';

const FormFieldInner = ({
  error,
  name,
  label,
  helperText,
  register,
  required,
  children,
  ...rest
}) => {
  const helperId = `${name}-helper-text`;
  const isError = Boolean(error);

  return (
    <FormControl mb={4} isRequired={required} isInvalid={isError}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {children({ register, name, ...rest })}
      {!isError && helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const FormField = ({ name, children, ...rest }) => {
  const { errors, register } = useFormContext();
  const error = errors[name];
  return memo(<FormFieldInner error={error} register={register} {...rest} />);
};

export default FormField;
