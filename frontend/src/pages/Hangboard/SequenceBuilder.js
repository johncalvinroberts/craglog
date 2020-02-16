import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Icon, Text, InputRightAddon } from '@chakra-ui/core';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import { hangBoardMap } from '@/components/hangboards';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import { sequenceItemDefaultValue } from './SequenceCreate';
import { exercises, repetitionExercises } from '@/constants';
import { camelCaseToTitleCase } from '@/utils';

const exerciseOptions = exercises.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const draggingBoxShadow = '1px 2px 4px 0px rgba(78, 78, 78, 0.28)';

const HangboardPlaceholder = () => (
  <Box d="flex" justifyContent="center" alignItems="center" height="10rem">
    <Text size="md">No hangboard chosen</Text>
    <Text size="sm">Choose one from dropdown above</Text>
  </Box>
);

const ItemDraggable = ({ draggableId, index, isActive, ...props }) => {
  const { watch } = useFormContext();

  const nameBase = `sequence[${index}]`;
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
    <Draggable draggableId={draggableId} index={index}>
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
          <HangboardSequenceItem item={itemToPass} isActive={isActive} />
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
  const currentSequenceActiveHolds =
    watch(`sequence[${activeIndex}].activeHolds`) || [];

  const currentExercise = watch(`sequence[${activeIndex}].exercise`);
  console.log({ currentExercise, currentSequenceActiveHolds });
  const isCurrentExerciseReps = repetitionExercises.includes(currentExercise);
  const isCurrentExerciseCustom = currentExercise === 'custom';
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
        const isAlreadyChosen = currentSequenceActiveHolds.includes(id);

        if (isAlreadyChosen) {
          nextValue = currentSequenceActiveHolds.filter((item) => item !== id);
          setValue(name, nextValue);
          return;
        }

        if (!isAlreadyChosen) {
          nextValue = [...currentSequenceActiveHolds, id];
          setValue(name, nextValue);
        }
      }
    },
    [activeIndex, currentSequenceActiveHolds, setValue],
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
                    index={index}
                    draggableId={item.id}
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
            activeHolds={currentSequenceActiveHolds}
          />
        </Box>
        {fields.map((item, index) => {
          const nameBase = `sequence[${index}]`;
          return (
            <Box
              d={index === activeIndex ? 'flex' : 'none'}
              key={item.id}
              p={2}
              flexWrap="wrap"
              justifyContent="center"
            >
              <SelectField
                name={`${nameBase}.exercise`}
                label="Exercise"
                options={exerciseOptions}
                required
              />
              {isCurrentExerciseCustom && (
                <TextField
                  name={`${nameBase}.customExerciseName`}
                  label="Custom Exercise Name"
                  required
                />
              )}

              {!isCurrentExerciseReps && (
                <TextField
                  type="number"
                  name={`${nameBase}.duration`}
                  label="Duration"
                  min={0}
                  required
                  adornmentRight={
                    <InputRightAddon fontSize="xs">seconds</InputRightAddon>
                  }
                  rounded="0.25rem 0 0 0.25rem"
                />
              )}
              {isCurrentExerciseReps && (
                <TextField
                  type="number"
                  name={`${nameBase}.repetitions`}
                  label="Repetitions"
                  min={0}
                  required
                  adornmentRight={
                    <InputRightAddon fontSize="xs">reps</InputRightAddon>
                  }
                  rounded="0.25rem 0 0 0.25rem"
                />
              )}
              <TextField
                type="number"
                name={`${nameBase}.rest`}
                label="Rest"
                min={0}
                adornmentRight={
                  <InputRightAddon fontSize="xs">seconds</InputRightAddon>
                }
                rounded="0.25rem 0 0 0.25rem"
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
