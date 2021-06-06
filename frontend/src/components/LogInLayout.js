import React from 'react';
import { Box } from '@chakra-ui/core';

const LogIn = ({ children, maxW = '400px' }) => {
  return (
    <Box
      minH="100vh"
      d="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box pb={20} w="100%" maxW={maxW}>
        {children}
      </Box>
    </Box>
  );
};

export default LogIn;
