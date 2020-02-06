import React from 'react';
import { Box, Heading, Icon } from '@chakra-ui/core';

const EmptyView = ({ message = 'Nothing.', children, ...props }) => {
  return (
    <Box
      d="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100px"
      {...props}
    >
      <Icon name="warning-2" mr={2} />
      <Heading size="s">{message}</Heading>
      {children}
    </Box>
  );
};

export default EmptyView;
