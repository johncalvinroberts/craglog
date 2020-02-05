import React from 'react';
import { Box, Tooltip, Icon } from '@chakra-ui/core';

const Marker = ({ label, ...props }) => {
  return (
    <Box {...props}>
      <Tooltip label={label}>
        <Icon name="marker" size="50px" />
      </Tooltip>
    </Box>
  );
};
export default Marker;
