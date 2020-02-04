import React, { memo } from 'react';
import { Input, InputGroup } from '@chakra-ui/core';
import FormField from './FormField';

const TextField = ({
  name,
  adornmentLeft,
  required,
  type = 'text',
  adornmentRight,
  ...rest
}) => {
  const hasAdornment = adornmentLeft || adornmentRight;

  return (
    <FormField name={name} required={required} {...rest}>
      {({ register, helperId }) => {
        const Inner = (
          <Input
            id={name}
            aria-describedby={helperId}
            type={type}
            required={required}
            name={name}
            ref={register}
            {...rest}
          />
        );
        if (hasAdornment) {
          return (
            <InputGroup>
              {adornmentLeft}
              {Inner}
              {adornmentRight}
            </InputGroup>
          );
        }
        return Inner;
      }}
    </FormField>
  );
};

export default memo(TextField);
