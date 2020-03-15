import React, { useMemo } from 'react';
import { PseudoBox, Text, Box } from '@chakra-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { boards } from '@/constants';
import { hangBoardMap } from './hangboards';
import { calculateSequenceTimeInWords } from '@/utils';

const SequenceCard = ({ sequence, children, ...props }) => {
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
      d="flex"
      justifyContent="flex-start"
      alignItems="center"
      {...props}
    >
      <Box
        as={RouterLink}
        to={`/app/hangboard/sequence/${sequence.id}`}
        d="flex"
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        flexWrap="wrap"
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
        <Box d={['block', 'none']}>
          <Text fontSize="sm" width="auto" height="auto">
            {totalTime}
          </Text>
        </Box>
        <Text width="auto" height="auto" fontSize="md" mr={[2, 0]}>
          {boardName}
        </Text>
        <Box flex="1" ml={1}>
          <Box maxWidth="180px" margin="0 auto">
            <Hangboard height="42px" />
          </Box>
        </Box>
        <Box flex="0 0 100%" pl="6rem" d={['none', 'block']}>
          <Text fontSize="sm" width="auto" height="auto">
            {totalTime}
          </Text>
        </Box>
      </Box>
      {children}
    </PseudoBox>
  );
};

export default SequenceCard;
