import React from 'react';
import { InputRightElement, IconButton, useDisclosure } from '@chakra-ui/core';
import TextField from './TextField';

const PasswordInput = (props) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <TextField
      {...props}
      type={isOpen ? 'text' : 'password'}
      required
      adornmentRight={
        <InputRightElement>
          <IconButton
            h="1.75rem"
            size="sm"
            onClick={onToggle}
            icon={isOpen ? 'view-off' : 'view'}
          />
        </InputRightElement>
      }
    />
  );
};

export default PasswordInput;
