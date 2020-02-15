import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Icon, Text } from '@chakra-ui/core';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import { hangBoardMap } from '@/components/hangboards';
import { sequenceItemDefaultValue } from './SequenceCreate';

const draggingBoxShadow = '1px 2px 4px 0px rgba(78, 78, 78, 0.28)';

const HangboardPlaceholder = () => (
  <Box d="flex" justifyContent="center" alignItems="center" height="10rem">
    <Text size="md">No hangboard chosen</Text>
    <Text size="sm">Choose one from dropdown above</Text>
  </Box>
);

const ItemDraggable = ({ item, index, isActive, ...props }) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          boxShadow={snapshot.isDragging ? draggingBoxShadow : ''}
          borderBottomWidth="1px"
          style={provided.draggableProps.style}
          {...props}
        >
          <HangboardSequenceItem item={item} isActive={isActive} />
        </Box>
      )}
    </Draggable>
  );
};

const SequenceBuilder = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    control,
    watch,
    setValue,
    register,
    defaultValues,
  } = useFormContext();

  const boardName = watch('boardName');
  const activeSequenceActiveHolds =
    watch(`sequence[${activeIndex}].activeHolds`) || [];
  const Hangboard = useMemo(
    () => hangBoardMap[boardName] || HangboardPlaceholder,
    [boardName],
  );
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'sequence',
  });

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      append(sequenceItemDefaultValue);
      const name = `sequence[${fields.length}].activeHolds`;
      register({ name });
      setValue(name, []);
    },
    [append, fields.length, register, setValue],
  );

  const handleSelectItem = useCallback(
    (index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  const handleRemove = useCallback(
    (index) => {
      remove(index);
    },
    [remove],
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
        const isAlreadyChosen = activeSequenceActiveHolds.includes(id);
        const isLimitReached = activeSequenceActiveHolds.length > 1;

        if (isAlreadyChosen) {
          nextValue = activeSequenceActiveHolds.filter((item) => item !== id);
          setValue(name, nextValue);
          return;
        }

        if (!isAlreadyChosen && !isLimitReached) {
          nextValue = [...activeSequenceActiveHolds, id];
          setValue(name, nextValue);
        }
      }
    },
    [activeIndex, activeSequenceActiveHolds, setValue],
  );

  useEffect(() => {
    defaultValues.sequence.forEach((_, index) => {
      const name = `sequence[${index}].activeHolds`;
      register({ name });
    });
  }, [register, defaultValues]);

  return (
    <Box borderWidth="1px" d="flex">
      <Box borderRightWidth="1px" position="relative" flex="0 0 13rem">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                overflowY="scroll"
                maxHeight="600px"
              >
                {fields.map((item, index) => (
                  <ItemDraggable
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => handleSelectItem(index)}
                    isActive={activeIndex === index}
                    handleRemove={() => handleRemove(index)}
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
          width="13rem"
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
            activeHolds={activeSequenceActiveHolds}
          />
        </Box>
        {fields.map((item, index) => (
          <Box d={index === activeIndex ? 'block' : 'none'} key={item.id}>
            {index}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
