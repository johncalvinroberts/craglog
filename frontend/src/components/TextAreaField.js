import React, { memo } from 'react';
import { Textarea } from '@chakra-ui/core';
import FormField from './FormField';

const TextAreaField = ({ name, required, ...rest }) => {
  const styleProps = {
    formControl: {
      maxWidth: 'unset',
    },
    helperText: {
      maxWidth: 'unset',
    },
  };

  return (
    <FormField
      name={name}
      required={required}
      styleProps={styleProps}
      {...rest}
    >
      {({ register, helperId }) => {
        return (
          <Textarea
            id={name}
            aria-describedby={helperId}
            required={required}
            name={name}
            ref={register}
            {...rest}
          />
        );
      }}
    </FormField>
  );
};

export default memo(TextAreaField);
