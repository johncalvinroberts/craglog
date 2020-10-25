import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Box, IconButton, Collapse, useDisclosure } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import _get from 'lodash/get';
import { useArrayFieldUtils } from '@/hooks';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import EmptyView from '@/components/EmptyView';
import { hangBoardMap } from '@/components/hangboards';
import { scrollToRef } from '@/utils';
import { AddButton, HangboardPlaceholder } from './SequenceBuilder';
import SequenceBuilderItemFields from './SequenceBuilderItemFields';

const SequenceBuilderMobileItem = ({
  id,
  handleDelete,
  handleDuplicate,
  isFinalItem,
  handleMoveUp,
  handleMoveDown,
}) => {
  const ref = useRef();
  const nameBase = `sequence[${id}]`;
  const { watch, setValue, errors } = useFormContext();

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

  const activeHolds = watch(`${nameBase}.activeHolds`) || [];

  const boardName = watch('boardName');

  const { isOpen, onToggle, onOpen } = useDisclosure();
  const Hangboard = useMemo(
    () => hangBoardMap[boardName] || HangboardPlaceholder,
    [boardName],
  );

  const handleClickHold = useCallback(
    (id) => {
      const name = `${nameBase}.activeHolds`;
      let nextValue;
      const isAlreadyChosen = activeHolds.includes(id);

      if (isAlreadyChosen) {
        nextValue = activeHolds.filter((item) => item !== id);
      }

      if (!isAlreadyChosen) {
        nextValue = [...activeHolds, id];
      }
      setValue(name, nextValue);
    },
    [activeHolds, nameBase, setValue],
  );

  useEffect(() => {
    if (isFinalItem) scrollToRef(ref);
  }, [isFinalItem]);

  const relevantErrors = _get(errors, nameBase);
  useEffect(() => {
    if (relevantErrors) {
      onOpen();
      scrollToRef(ref);
    }
  }, [onOpen, onToggle, relevantErrors]);

  return (
    <Box
      borderWidth="1px"
      d="flex"
      borderBottomWidth={isFinalItem ? '1px' : 0}
      flexWrap="wrap"
      ref={ref}
    >
      <Box flex="1" onClick={onToggle}>
        <HangboardSequenceItem
          item={itemToPass}
          px={2}
          minHeight="5rem"
          borderRightWidth="1px"
          isActive={isOpen}
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
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            />
            <IconButton
              icon="copy"
              variant="ghost"
              color="gray.500"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate();
              }}
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
          borderBottomWidth={isOpen ? '1px' : 0}
        />
      </Box>
      <Box flex=" 0 0 100%">
        <Collapse isOpen={isOpen} animateOpacity>
          <Box mb={2}>
            {isOpen && (
              <Box p={2}>
                <Hangboard
                  handleClickHold={handleClickHold}
                  activeHolds={activeHolds}
                />
              </Box>
            )}

            <SequenceBuilderItemFields id={id} />
          </Box>
        </Collapse>
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

  const handleMoveDown = useCallback(
    (index) => {
      if (index === indexes.length - 1) {
        return;
      }
      move(index, index + 1);
    },
    [indexes.length, move],
  );

  const handleMoveUp = useCallback(
    (index) => {
      if (index === 0) {
        return;
      }
      move(index, index - 1);
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
      <AddButton
        handleAdd={handleAdd}
        width="100%"
        position="fixed"
        zIndex="999"
      />
    </Box>
  );
};

export default SequenceBuilderMobile;
