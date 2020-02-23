import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Icon, Text, InputRightAddon, IconButton } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PseudoButton from '@/components/PseudoButton';
import HangboardSequenceItem from '@/components/HangboardSequenceItem';
import { hangBoardMap } from '@/components/hangboards';
import SelectField from '@/components/SelectField';
import TextField from '@/components/TextField';
import { sequenceItemDefaultValue } from './SequenceCreate';
import { exercises, repetitionExercises } from '@/constants';
import { camelCaseToTitleCase, getUuidV4 } from '@/utils';
import { useArrayFieldUtils } from '@/hooks';

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

const ItemFormFields = ({ index, ...rest }) => {
  const { watch, register, unregister } = useFormContext();
  const nameBase = `sequence[${index}]`;
  const exercise = watch(`${nameBase}.exercise`);
  const isReps = repetitionExercises.includes(exercise);
  const isCustom = exercise === 'custom';

  useEffect(() => {
    // console.log('I AM RUNNING....STOP ME', `${nameBase}.activeHolds`);
    register({ name: `${nameBase}.activeHolds` });
    return () => {
      unregister(`${nameBase}.activeHolds`);
    };
  }, [nameBase, register, unregister]);

  return (
    <Box {...rest} p={2} flexWrap="wrap" justifyContent="center">
      <SelectField
        name={`${nameBase}.exercise`}
        label="Exercise"
        options={exerciseOptions}
        defaultValue={sequenceItemDefaultValue.exercise}
        required
      />
      {isCustom && (
        <TextField
          name={`${nameBase}.customExerciseName`}
          label="Custom Exercise Name"
          required
        />
      )}

      {!isReps && (
        <TextField
          type="number"
          name={`${nameBase}.duration`}
          label="Duration"
          min={0}
          required
          defaultValue={sequenceItemDefaultValue.duration}
          adornmentRight={
            <InputRightAddon fontSize="xs">seconds</InputRightAddon>
          }
          rounded="0.25rem 0 0 0.25rem"
        />
      )}
      {isReps && (
        <TextField
          type="number"
          name={`${nameBase}.repetitions`}
          label="Repetitions"
          min={0}
          defaultValue={sequenceItemDefaultValue.repetitions}
          required
          adornmentRight={<InputRightAddon fontSize="xs">reps</InputRightAddon>}
          rounded="0.25rem 0 0 0.25rem"
        />
      )}
      <TextField
        type="number"
        name={`${nameBase}.rest`}
        label="Rest"
        min={0}
        defaultValue={sequenceItemDefaultValue.rest}
        adornmentRight={
          <InputRightAddon fontSize="xs">seconds</InputRightAddon>
        }
        rounded="0.25rem 0 0 0.25rem"
      />
    </Box>
  );
};

const ItemDraggable = ({
  draggableId,
  index,
  isActive,
  handleDelete,
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

  const handleDuplicate = () => {};

  const handleMouseOver = () => {};

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
          <HangboardSequenceItem
            item={itemToPass}
            isActive={isActive}
            onMouseOver={handleMouseOver}
            onFocus={() => {}}
          >
            <Box flex="1" d="flex" justifyContent="flex-end">
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
  const [indexes, setIndexes] = useState([]);
  const [, setCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const { watch, setValue } = useFormContext();

  const boardName = watch('boardName');

  const currentSequenceActiveHolds =
    watch(`sequence[${activeIndex}].activeHolds`) || [];

  const Hangboard = useMemo(
    () => hangBoardMap[boardName] || HangboardPlaceholder,
    [boardName],
  );

  const { move, remove } = useArrayFieldUtils('sequence');

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    setIndexes((prevIndexes) => [...prevIndexes, getUuidV4()]);
    setCount((prevCount) => prevCount + 1);
  }, []);

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
    (index, id) => {
      setIndexes((indexes) => indexes.filter((current) => current !== id));
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
                {indexes.map((id, index) => (
                  <ItemDraggable
                    key={id}
                    index={index}
                    draggableId={id}
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
        {indexes.map((item, index) => (
          <ItemFormFields
            index={index}
            d={index === activeIndex ? 'flex' : 'none'}
            key={item}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SequenceBuilder;
