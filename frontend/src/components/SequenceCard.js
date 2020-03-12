import React, { useMemo } from 'react';
import { PseudoBox, Text, Box } from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { boards } from '@/constants';
import { hangBoardMap } from './hangboards';
import { calculateSequenceTimeInWords } from '@/utils';

const SequenceCard = ({ sequence, ...props }) => {
  const boardName = useMemo(() => {
    const board = boards.find((item) => item.value === sequence.boardName);
    return board && board.label;
  }, [sequence.boardName]);

  const totalTime = useMemo(
    () => calculateSequenceTimeInWords(sequence.sequence),
    [sequence.sequence],
  );
  const Hangboard = useMemo(() => hangBoardMap[sequence.boardName] || <></>, [
    sequence.boardName,
  ]);
  return (
    <PseudoBox
      p={2}
      mb={2}
      borderWidth="1px"
      _hover={{ transform: 'translateX(2px)' }}
      transition="all 0.2s"
      as={RouterLink}
      d="flex"
      justifyContent="flex-start"
      alignItems="center"
      width="100%"
      flexWrap="wrap"
      to={`/app/hangboard/sequence/${sequence.id}/edit`}
      {...props}
    >
      <Text
        width="6rem"
        height="auto"
        fontWeight="500"
        fontSize="xl"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        d="block"
      >
        {sequence.name}
      </Text>
      <Text width="auto" height="auto" fontSize="md">
        {boardName}
      </Text>
      <Box flex="1" ml={1}>
        <Box maxWidth="180px" margin="0 auto">
          <Hangboard height="42px" />
        </Box>
      </Box>
      <Box flex="0 0 100%" pl="6rem">
        <Text fontSize="sm" width="auto" height="auto">
          {totalTime}
        </Text>
      </Box>
    </PseudoBox>
  );
};

export default SequenceCard;
