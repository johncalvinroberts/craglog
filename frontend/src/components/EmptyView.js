import React from 'react';
import { Box, Heading, Icon } from '@chakra-ui/core';

const EmptyView = ({ message = 'Nothing.', children, ...props }) => {
  return (
    <Box
      d="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100px"
      flexWrap="wrap"
      {...props}
    >
      <Icon name="warning-2" mr={2} />
      <Heading size="s">{message}</Heading>
      {children && (
        <Box width="100%" d="flex" justifyContent="center">
          {children}
        </Box>
      )}
    </Box>
  );
};

export default EmptyView;
