import React, { useCallback } from 'react';
import { Box, IconButton } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import { AddButton } from './SequenceBuilder';
import { useArrayFieldUtils } from '@/hooks';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import EmptyView from '@/components/EmptyView';

const SequenceBuilderMobileItem = ({
  id,
  handleDelete,
  handleDuplicate,
  isFinalItem,
  handleMoveUp,
  handleMoveDown,
}) => {
  const nameBase = `sequence[${id}]`;
  const { watch } = useFormContext();

  const exercise = watch(`${nameBase}.exercise`);
  const repetitions = watch(`${nameBase}.repetitions`);
  const duration = watch(`${nameBase}.duration`);
  const customExerciseName = watch(`${nameBase}.customExerciseName`);
  const rest = watch(`${nameBase}.rest`);
  const itemToPass = {
    exercise,
    repetitions,
    duration,
    customExerciseName,
    rest,
  };
  return (
    <Box borderWidth="1px" d="flex" borderBottomWidth={isFinalItem ? '1px' : 0}>
      <Box flex="1">
        <HangboardSequenceItem
          item={itemToPass}
          px={2}
          minHeight="5rem"
          borderRightWidth="1px"
        >
          <Box
            flex="1"
            d="flex"
            justifyContent="flex-end"
            transition="opacity 0.2s ease"
          >
            <IconButton
              icon="delete"
              variant="ghost"
              color="gray.500"
              onClick={handleDelete}
            />
            <IconButton
              icon="copy"
              variant="ghost"
              color="gray.500"
              onClick={handleDuplicate}
            />
          </Box>
        </HangboardSequenceItem>
      </Box>
      <Box d="flex" flexDirection="column">
        <IconButton
          icon="arrow-up"
          variant="ghost"
          color="gray.500"
          onClick={handleMoveUp}
          borderRadius="0"
        />
        <IconButton
          icon="arrow-down"
          variant="ghost"
          color="gray.500"
          onClick={handleMoveDown}
          borderRadius="0"
        />
      </Box>
    </Box>
  );
};

const SequenceBuilderMobile = () => {
  const { move, remove, add, indexes, duplicate } = useArrayFieldUtils(
    'sequence',
  );

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      add(indexes.length);
    },
    [add, indexes.length],
  );

  const handleDelete = useCallback((id) => remove(id), [remove]);

  const handleDuplicate = useCallback(
    (index) => {
      duplicate(index);
    },
    [duplicate],
  );

  const handleMoveUp = useCallback(
    (index) => {
      if (index === indexes.length - 1) {
        return;
      }
      move(index + 1);
    },
    [indexes.length, move],
  );

  const handleMoveDown = useCallback(
    (index) => {
      if (index === 0) {
        return;
      }
      move(index - 1);
    },
    [move],
  );

  return (
    <Box>
      {indexes.map(({ id }, index) => (
        <SequenceBuilderMobileItem
          id={id}
          key={id}
          handleDelete={() => handleDelete(id)}
          handleDuplicate={() => handleDuplicate(index)}
          handleMoveUp={() => handleMoveUp(index)}
          handleMoveDown={() => handleMoveDown(index)}
          isFinalItem={index === indexes.length - 1}
        />
      ))}
      {!indexes.length && <EmptyView message="Empty!" />}
      <AddButton handleAdd={handleAdd} width="100%" position="fixed" />
    </Box>
  );
};

export default SequenceBuilderMobile;
