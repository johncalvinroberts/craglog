import React from 'react';
import { Box } from '@chakra-ui/core';

const LogIn = ({ children }) => {
  return (
    <Box minH="100vh" d="flex" alignItems="center" justifyContent="center">
      <Box maxW="md" borderWidth="1px" rounded="md" overflow="hidden" p="4">
        {children}
      </Box>
    </Box>
  );
};

export default LogIn;
