import React from 'react';
import { Icon, Heading, Box } from '@chakra-ui/core';
import LoginLayout from '@/components/LogInLayout';
import { useTitle } from '@/hooks';

const NotFound = () => {
  useTitle('Not found');
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
