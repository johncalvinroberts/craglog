import React from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/core';

const bg = { light: 'white', dark: 'gray.800' };
const HangboardSequenceItem = ({ isActive, item }) => {
  const { colorMode } = useColorMode();
  const showRest = !!(
    item.rest &&
    typeof item.rest === 'number' &&
    item.rest > 0
  );

  return (
    <Box>
      <Box d="flex" p={2} bg={bg[colorMode]} alignItems="center">
        <Text
          fontSize="md"
          fontWeight={isActive ? 'bold' : ''}
          width="auto"
          height="auto"
          mr={2}
        >
          {item.exercise || <em>Empty</em>}
        </Text>
        <Text
          fontSize="xs"
          fontWeight={isActive ? 'bold' : ''}
          width="auto"
          height="auto"
        >
          {item.repetitions
            ? `${item.repetitions} reps`
            : `${item.duration || '0'}s`}
        </Text>
      </Box>
      {showRest && (
        <Box
          bg="red.200"
          {...(colorMode === 'dark' ? { color: 'white' } : null)}
        >
          <Text fontSize="xs" width="auto" height="auto">
            Rest {item.rest}s
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default HangboardSequenceItem;
