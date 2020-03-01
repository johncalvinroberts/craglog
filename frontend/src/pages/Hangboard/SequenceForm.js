import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Box, Button } from '@chakra-ui/core';
import Form, { SelectField, TextField } from '@/components/Form';

import { useDispatch } from '@/components/State';
import { toggleMobileNav } from '@/states';
import { boards } from '@/constants';
import SequenceBuilder from './SequenceBuilder';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  boardName: yup.string().required(),
  sequence: yup
    .array()
    .transform((value, originalValue) => {
      return Object.keys(originalValue)
        .map((key) => originalValue[key])
        .filter(Boolean);
    })
    .of(
      yup.object().shape({
        rest: yup
          .number()
          .nullable()
          .default(0)
          .label('rest'),
        repetitions: yup
          .number()
          .default(0)
          .nullable()
          .label('repetitions'),
        duration: yup
          .number()
          .default(0)
          .nullable()
          .label('duration'),
        customExerciseName: yup
          .string()
          .nullable()
          .label('Custom Exercise Name'),
        exercise: yup
          .string()
          .required()
          .label('exercise'),
        activeHolds: yup
          .array()
          .default([])
          .label('Holds'),
      }),
    ),
});

const SequenceForm = ({ defaultValues, onSubmit }) => {
  const dispatch = useDispatch();
  const formMethods = useForm({ defaultValues, validationSchema });
  // toggle mobile nav on mount/unmount
  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
    >
      <Box d="flex" flexWrap="wrap" justifyContent="space-between">
        <SelectField
          name="boardName"
          label="Board"
          helperText="Select your hangboard"
          required
          options={boards}
        />
        <TextField
          name="name"
          label="Name"
          helperText="Give the workout a name"
          required
        />
      </Box>
      <SequenceBuilder />
      <Box
        position="fixed"
        bottom="20px"
        maxWidth="100px"
        right="20px"
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        <Button
          backgroundColor="teal.300"
          variant="solid"
          type="submit"
          loadingText="Submitting"
          color="white"
          mb={2}
        >
          Save
        </Button>
      </Box>
    </Form>
  );
};

export default SequenceForm;
