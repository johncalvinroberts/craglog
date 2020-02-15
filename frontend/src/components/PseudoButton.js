import React from 'react';
import { PseudoBox } from '@chakra-ui/core';

const PseudoButton = ({ children, ...props }) => {
  return (
    <PseudoBox
      as="button"
      _focus={{ outline: 'none' }}
      color="white"
      p={2}
      transition="all 0.3s"
      {...props}
    >
      {children}
    </PseudoBox>
  );
};

export default PseudoButton;
