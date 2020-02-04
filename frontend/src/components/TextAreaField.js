import React, { memo } from 'react';
import {
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';

const TextAreaFieldImpl = ({
  label,
  required = false,
  name,
  helperText,
  adornmentLeft,
  adornmentRight,
  error,
  register,
  ...props
}) => {
  const helperId = `${name}-helper-text`;
  const isError = Boolean(error);
  return (
    <FormControl mb={3} isRequired={required} isInvalid={isError}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Textarea
        id={name}
        aria-describedby={helperId}
        required={required}
        name={name}
        ref={register}
        {...props}
      />
      {!isError && helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const TextAreaField = ({ name, ...rest }) => {
  const { errors, register } = useFormContext();
  const error = errors[name];
  return (
    <TextAreaFieldImpl
      name={name}
      error={error}
      register={register}
      {...rest}
    />
  );
};

export default memo(TextAreaField);
