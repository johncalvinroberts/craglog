import React from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/core';
import { camelCaseToTitleCase } from '../utils';
import { repetitionExercises } from '../constants';

const bg = { light: 'white', dark: 'gray.800' };
const HangboardSequenceItem = ({ isActive, item, children, ...rest }) => {
  const { colorMode } = useColorMode();
  const showRest = item.rest && parseInt(item.rest, 10) > 0;
  const isReps = repetitionExercises.includes(item.exercise);

  const exerciseName = item.exercise ? (
    camelCaseToTitleCase(item.exercise)
  ) : (
    <em>Empty</em>
  );
  return (
    <Box>
      <Box d="flex" p={2} bg={bg[colorMode]} alignItems="center" {...rest}>
        <Text
          fontSize="md"
          fontWeight={isActive ? 'bold' : ''}
          width="auto"
          height="auto"
          mr={2}
        >
          {exerciseName}
        </Text>
        <Text
          fontSize="xs"
          fontWeight={isActive ? 'bold' : ''}
          width="auto"
          height="auto"
          mr={1}
        >
          {isReps ? `${item.repetitions} reps` : `${item.duration || '0'}s`}
        </Text>
        {showRest && (
          <Text
            fontSize="xs"
            width="auto"
            height="auto"
            fontWeight={isActive ? 'bold' : ''}
          >
            + {item.rest}s rest
          </Text>
        )}
        {/* children appear at end of the row */}
        {children}
      </Box>
    </Box>
  );
};

export default HangboardSequenceItem;
