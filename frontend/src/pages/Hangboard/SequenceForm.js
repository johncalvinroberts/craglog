import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Box, Button } from '@chakra-ui/core';
import Form, { SelectField, TextField } from '@/components/Form';
import { useWindowSize } from '@/hooks';
import { useDispatch } from '@/components/State';
import { toggleMobileNav } from '@/states';
import { boards } from '@/constants';
import { UtilBar } from '@/components/DashboardHeader';
import SequenceBuilder from './SequenceBuilder';
import SequenceBuilderMobile from './SequenceBuilderMobile';

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
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 650;
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
      id="sequence-form"
    >
      <UtilBar>
        <Button
          backgroundColor="teal.300"
          variant="solid"
          type="submit"
          loadingText="Submitting"
          color="white"
          form="sequence-form"
          borderRadius="0"
          _hover={{ backgroundColor: 'teal.400' }}
        >
          Save
        </Button>
      </UtilBar>
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
      {!isMobile && <SequenceBuilder />}
      {isMobile && <SequenceBuilderMobile />}
    </Form>
  );
};

export default SequenceForm;
