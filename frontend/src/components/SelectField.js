import React, { memo } from 'react';
import {
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';

const SelectFieldImpl = ({
  label,
  required = false,
  name,
  helperText,
  adornmentLeft,
  adornmentRight,
  error,
  register,
  options = [],
  placeholder = 'Select option',
  ...props
}) => {
  const helperId = `${name}-helper-text`;
  const isError = Boolean(error);
  return (
    <FormControl mb={3} isRequired={required} isInvalid={isError}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Select placeholder={placeholder} {...props}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {!isError && helperText && (
        <FormHelperText id={helperId}>{helperText}</FormHelperText>
      )}
      {isError && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

const SelectField = ({ name, ...rest }) => {
  const { errors, register } = useFormContext();
  const error = errors[name];
  return (
    <SelectFieldImpl name={name} error={error} register={register} {...rest} />
  );
};

export default memo(SelectField);
