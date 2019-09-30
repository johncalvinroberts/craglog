import React from 'react';
import { Box } from '@chakra-ui/core';

const LogIn = ({ children }) => {
  return (
    <Box minH="100vh" d="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

export default LogIn;
