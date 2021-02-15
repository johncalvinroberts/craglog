import React from 'react';
import { Box as PseudoBox } from '@chakra-ui/core';

const PseudoButton = ({ children, ...props }) => {
  return (
    <PseudoBox
      as="button"
      _focus={{ outline: 'none' }}
      p={2}
      transition="all 0.3s"
      {...props}
    >
      {children}
    </PseudoBox>
  );
};

export default PseudoButton;
