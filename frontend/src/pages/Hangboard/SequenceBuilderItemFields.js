import React, { useEffect } from 'react';
import { Box, InputRightAddon } from '@chakra-ui/core';
import { useFormContext } from 'react-hook-form';
import { SelectField, TextField } from '../../components/Form';
import { exercises, repetitionExercises } from '../../constants';
import { camelCaseToTitleCase } from '../../utils';
import { sequenceItemDefaultValue } from './SequenceCreate';

const exerciseOptions = exercises.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const SequenceBuilderItemFields = ({ id, ...rest }) => {
  const { watch, register, unregister } = useFormContext();
  const nameBase = `sequence[${id}]`;
  const exercise = watch(`${nameBase}.exercise`);
  const isReps = repetitionExercises.includes(exercise);
  const isCustom = exercise === 'custom';

  useEffect(() => {
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
      <div
        style={{
          display: !isReps ? 'block' : 'none',
          width: '100%',
          maxWidth: '310px',
        }}
      >
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
      </div>
      <div
        style={{
          display: isReps ? 'block' : 'none',
          width: '100%',
          maxWidth: '310px',
        }}
      >
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
      </div>
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

export default SequenceBuilderItemFields;
