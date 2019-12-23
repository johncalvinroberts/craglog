import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  InputGroup,
} from '@chakra-ui/core';

const TextFieldImpl = ({
  label,
  required = false,
  type = 'text',
  name,
  helperText,
  adornmentLeft,
  adornmentRight,
  error,
  register,
  ...props
}) => {
  const helperId = `${name}-helper-text`;
  const Inner = (
    <Input
      id={name}
      aria-describedby={helperId}
      type={type}
      required={required}
      name={name}
      ref={register}
      {...props}
    />
  );

  const isError = Boolean(error);
  const hasAdornment = adornmentLeft || adornmentRight;

  return (
    <FormControl mb={3} isRequired={required} isInvalid={isError}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      {hasAdornment && (
        <InputGroup>
          {adornmentLeft}
          {Inner}
          {adornmentRight}
        </InputGroup>
      )}
      {!hasAdornment && Inner}
      {!isError && helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const TextField = ({ name, ...rest }) => {
  const { errors, register } = useFormContext();
  const error = errors[name];
  return (
    <TextFieldImpl name={name} error={error} register={register} {...rest} />
  );
};

export default memo(TextField);
