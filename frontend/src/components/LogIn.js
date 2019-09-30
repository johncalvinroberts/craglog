import React from 'react';
import { Box, Heading, Icon } from '@chakra-ui/core';
import useLayout from '../hooks/useLayout';
import LoginLayout from '../layouts/LogIn';

const LogIn = () => {
  useLayout(LoginLayout);
  return (
    <Box pb={20}>
      <Box mb={8} d="block">
        <Icon name="logo" size="60px" />
        <Heading>Log in to craglog</Heading>
      </Box>
      <Box maxW="md" borderWidth="1px" rounded="sm" overflow="hidden" p="4">
        login
      </Box>
    </Box>
  );
};

export default LogIn;
