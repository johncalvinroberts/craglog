import React, { memo } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  FormHelperText,
  InputGroup,
} from '@chakra-ui/core';
import isEqual from 'lodash/isEqual';

const areEqual = ({ formal: prevFormal }, { formal: nextFormal }) => {
  if (!prevFormal || !nextFormal) {
    return true;
  }
  return isEqual(prevFormal, nextFormal);
};

const TextField = ({
  formal,
  label,
  required = false,
  type = 'text',
  id,
  helperText,
  adornmentLeft,
  adornmentRight,
}) => {
  const { error } = formal;
  const helperId = `${id}-helper-text`;
  const Inner = (
    <Input
      id={id}
      aria-describedby={helperId}
      type={type}
      required={required}
      {...formal}
    />
  );
  const hasAdornment = adornmentLeft || adornmentRight;
  return (
    <FormControl mb={3} isRequired={required} isInvalid={error}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      {hasAdornment && (
        <InputGroup>
          {adornmentLeft}
          {Inner}
          {adornmentRight}
        </InputGroup>
      )}
      {!hasAdornment && Inner}
      {!error && helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default memo(TextField, areEqual);
