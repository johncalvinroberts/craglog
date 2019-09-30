import React from 'react';
import { Icon, Heading, Box } from '@chakra-ui/core';
import useLayout from '../hooks/useLayout';
import LogIn from '../layouts/LogIn';

const NotFound = () => {
  useLayout(LogIn);
  return (
    <Box d="flex" justifyContent="center" flexWrap="wrap">
      <Icon name="not-allowed" color="red.300" size="xs" />
      <Heading size="lg" flex="0 0 100%" textAlign="center">
        Page Not Found
      </Heading>
    </Box>
  );
};

export default NotFound;
