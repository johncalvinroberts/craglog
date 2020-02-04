import React from 'react';
import { Select } from '@chakra-ui/core';
import FormField from './FormField';

const SelectField = ({
  name,
  placeholder = 'Select option',
  options = [],
  ...rest
}) => {
  return (
    <FormField name={name} {...rest}>
      {({ register, helperId }) => {
        return (
          <Select
            placeholder={placeholder}
            ref={register}
            name={name}
            aria-describedby={helperId}
          >
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        );
      }}
    </FormField>
  );
};

export default SelectField;
