import React from 'react';
import { Box } from '@chakra-ui/core';
import { camelCaseToTitleCase } from '../utils';

const tickStyleStyles = {
  hangboard: { backgroundColor: 'cyan.400', color: 'white' },
  gym: { backgroundColor: 'purple.200' },
  solo: { backgroundColor: 'red.600', color: 'white' },
  boulder: { backgroundColor: 'red.400', color: 'white' },
  toprope: { backgroundColor: 'orange.200' },
  sport: { backgroundColor: 'green.300', color: 'white' },
  trad: { backgroundColor: 'blue.300', color: 'white' },
  other: { backgroundColor: 'green.300', color: 'white' },
};

function TickStyleChip({ style }) {
  return (
    <Box {...tickStyleStyles[style]} textTransform="uppercase" px={1}>
      {camelCaseToTitleCase(style)}
    </Box>
  );
}

export default TickStyleChip;
