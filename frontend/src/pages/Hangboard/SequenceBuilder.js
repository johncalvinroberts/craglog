import React, { useState, useMemo, useCallback } from 'react';
import { Box, Icon, Text, IconButton } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import { hangBoardMap } from '@/components/hangboards';
import { useArrayFieldUtils, useHover } from '@/hooks';
import SequenceBuilderItemFields from './SequenceBuilderItemFields';

const draggingBoxShadow = '1px 2px 4px 0px rgba(78, 78, 78, 0.28)';

const HangboardPlaceholder = () => (
  <Box d="flex" justifyContent="center" alignItems="center" height="10rem">
    <Text size="md">No hangboard chosen</Text>
    <Text size="sm">Choose one from dropdown above</Text>
  </Box>
);

const ItemDraggable = ({
  draggableId,
  index,
  isActive,
  handleDelete,
  realIndex,
  ...props
}) => {
  const nameBase = `sequence[${index}]`;
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

  const handleDuplicate = () => {};

  const handleMouseOver = () => {};

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
          <HangboardSequenceItem
            item={itemToPass}
            isActive={isActive}
            onMouseOver={handleMouseOver}
            onFocus={() => {}}
          >
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
  const [activeIndex, setActiveIndex] = useState(0);
  const { watch, setValue } = useFormContext();

  const boardName = watch('boardName');

  const currentSequenceActiveHolds =
    watch(`sequence[${activeIndex}].activeHolds`) || [];

  const Hangboard = useMemo(
    () => hangBoardMap[boardName] || HangboardPlaceholder,
    [boardName],
  );

  const { move, remove, add, indexes } = useArrayFieldUtils('sequence');

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      add();
    },
    [add],
  );

  const handleSelectItem = useCallback(
    (index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      const { source, destination } = result;
      move(source.index, destination.index);
      if (source.index === activeIndex) {
        setActiveIndex(destination.index);
      }
    },
    [activeIndex, move],
  );

  const handleClickHold = useCallback(
    (id) => {
      if (typeof activeIndex === 'number') {
        const name = `sequence[${activeIndex}].activeHolds`;
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
    [activeIndex, currentSequenceActiveHolds, setValue],
  );

  const handleDelete = useCallback(
    (index) => {
      remove(index);
    },
    [remove],
  );

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
                {indexes.map(({ index, id }, realIndex) => (
                  <ItemDraggable
                    key={id}
                    index={index}
                    draggableId={id}
                    realIndex={realIndex}
                    onClick={() => handleSelectItem(index)}
                    isActive={activeIndex === index}
                    handleDelete={() => handleDelete(index, id)}
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <PseudoButton
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          d="flex"
          justifyContent="center"
          alignItems="center"
          height="3rem"
          width="17rem"
          _hover={{
            backgroundColor: 'teal.400',
          }}
          backgroundColor="teal.300"
          onClick={handleAdd}
        >
          <Icon name="add" />
        </PseudoButton>
      </Box>
      <Box flexGrow="1" height="600px">
        <Box p={2}>
          <Hangboard
            handleClickHold={handleClickHold}
            activeHolds={currentSequenceActiveHolds}
          />
        </Box>
        {indexes.map(({ id, index }) => (
          <SequenceBuilderItemFields
            index={index}
            d={index === activeIndex ? 'flex' : 'none'}
            key={id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
