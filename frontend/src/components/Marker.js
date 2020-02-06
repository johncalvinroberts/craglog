import React from 'react';
import { Box, Tooltip, Icon } from '@chakra-ui/core';

const Marker = ({ label, color, ...props }) => {
  return (
    <Box {...props} color={color}>
      <Tooltip label={label}>
        <Icon name="marker" size="50px" color={color} />
      </Tooltip>
    </Box>
  );
};
export default Marker;
