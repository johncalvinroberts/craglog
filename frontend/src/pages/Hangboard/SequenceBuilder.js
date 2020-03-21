import React, { useState, useMemo, useCallback, useEffect } from 'react';
import _get from 'lodash/get';
import { Box, Icon, Text, IconButton } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import { hangBoardMap } from '@/components/hangboards';
import { useArrayFieldUtils, useHover } from '@/hooks';
import SequenceBuilderItemFields from './SequenceBuilderItemFields';

const draggingBoxShadow = '1px 2px 4px 0px rgba(78, 78, 78, 0.28)';

export const AddButton = ({ handleAdd, ...rest }) => (
  <PseudoButton
    position="absolute"
    bottom="0"
    left="0"
    right="0"
    d="flex"
    color="white"
    justifyContent="center"
    alignItems="center"
    height="3rem"
    width="17rem"
    _hover={{
      backgroundColor: 'teal.400',
    }}
    backgroundColor="teal.300"
    onClick={handleAdd}
    {...rest}
  >
    <Icon name="add" />
  </PseudoButton>
);

export const HangboardPlaceholder = () => (
  <Box height="10rem" d="flex" alignItems="center" justifyContent="center">
    <Box>
      <Text size="md" height="2rem" width="auto" d="block" textAlign="center">
        No hangboard chosen
      </Text>
      <Text size="sm" height="2rem" width="auto" d="block" textAlign="center">
        Choose one from dropdown above
      </Text>
    </Box>
  </Box>
);

const ItemDraggable = ({
  draggableId,
  isActive,
  handleDelete,
  realIndex,
  handleDuplicate,
  ...props
}) => {
  const nameBase = `sequence[${draggableId}]`;
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

  const [hovered, bindHover] = useHover();

  return (
    <Draggable draggableId={draggableId} index={realIndex}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          boxShadow={snapshot.isDragging ? draggingBoxShadow : ''}
          borderBottomWidth="1px"
          style={provided.draggableProps.style}
          {...props}
          {...bindHover}
        >
          <HangboardSequenceItem item={itemToPass} isActive={isActive}>
            <Box
              flex="1"
              d="flex"
              justifyContent="flex-end"
              opacity={['1', '1', hovered ? '1' : '0']}
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
                onClick={handleDuplicate}
              />
            </Box>
          </HangboardSequenceItem>
        </Box>
      )}
    </Draggable>
  );
};

const SequenceBuilder = () => {
  const { move, remove, add, indexes, duplicate } = useArrayFieldUtils(
    'sequence',
  );
  const [activeId, setActiveId] = useState(0);
  const { watch, setValue, errors } = useFormContext();

  const boardName = watch('boardName');

  const currentSequenceActiveHolds =
    watch(`sequence[${activeId}].activeHolds`) || [];

  const Hangboard = useMemo(
    () => hangBoardMap[boardName] || HangboardPlaceholder,
    [boardName],
  );

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      add(indexes.length);
    },
    [add, indexes.length],
  );

  const handleSelectItem = useCallback(
    (id) => {
      setActiveId(id);
    },
    [setActiveId],
  );

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const { source, destination } = result;
      move(source.index, destination.index);
    },
    [move],
  );

  const handleClickHold = useCallback(
    (id) => {
      if (activeId) {
        const name = `sequence[${activeId}].activeHolds`;
        let nextValue;
        const isAlreadyChosen = currentSequenceActiveHolds.includes(id);

        if (isAlreadyChosen) {
          nextValue = currentSequenceActiveHolds.filter((item) => item !== id);
        }

        if (!isAlreadyChosen) {
          nextValue = [...currentSequenceActiveHolds, id];
        }
        setValue(name, nextValue);
      }
    },
    [activeId, currentSequenceActiveHolds, setValue],
  );

  const handleDelete = useCallback(
    (id) => {
      remove(id);
      if (activeId === id) {
        const prevIndex = indexes.findIndex((item) => item.id === id);
        const nextActiveId = _get(indexes, `[${prevIndex - 1}].id`, null);
        setActiveId(nextActiveId);
      }
    },
    [activeId, indexes, remove],
  );

  const handleDuplicate = useCallback(
    (index) => {
      duplicate(index);
    },
    [duplicate],
  );

  useEffect(() => {
    const initialActiveId = _get(indexes, '[0].id', null);
    if (!activeId && initialActiveId) setActiveId(initialActiveId);
  }, [activeId, indexes]);

  useEffect(() => {
    if (errors.sequence) {
      const nextActiveId = Object.keys(errors.sequence)[0];
      setActiveId(nextActiveId);
    }
  }, [errors]);

  return (
    <Box borderWidth="1px" d="flex">
      <Box borderRightWidth="1px" position="relative" flex="0 0 17rem">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                overflowY="scroll"
                maxHeight="600px"
              >
                {indexes.map(({ id }, realIndex) => (
                  <ItemDraggable
                    key={id}
                    draggableId={id}
                    realIndex={realIndex}
                    onClick={() => handleSelectItem(id)}
                    isActive={activeId === id}
                    handleDelete={() => handleDelete(id)}
                    handleDuplicate={() => handleDuplicate(realIndex)}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <AddButton handleAdd={handleAdd} />
      </Box>
      <Box flexGrow="1" height="600px">
        <Box p={2}>
          <Hangboard
            handleClickHold={handleClickHold}
            activeHolds={currentSequenceActiveHolds}
          />
        </Box>
        {indexes.map(({ id }) => (
          <SequenceBuilderItemFields
            id={id}
            d={id === activeId ? 'flex' : 'none'}
            key={id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
