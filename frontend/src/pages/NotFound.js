import React from 'react';
import { Icon, Heading, Box } from '@chakra-ui/core';
import { LoginLayout } from '../layouts';
import useTitle from '../hooks/useTitle';

const NotFound = () => {
  useTitle('Page not found');
  return (
    <LoginLayout>
      <Box d="flex" justifyContent="center" flexWrap="wrap">
        <Icon name="not-allowed" color="red.300" size="xs" />
        <Heading size="lg" flex="0 0 100%" textAlign="center">
          Page Not Found
        </Heading>
      </Box>
    </LoginLayout>
  );
};

export default NotFound;
