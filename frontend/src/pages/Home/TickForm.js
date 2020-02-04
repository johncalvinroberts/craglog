import React, { useEffect } from 'react';
import { Button, Box } from '@chakra-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Form from '../../components/Form';
import Map from '../../components/Map';
import { tickStyleEnum, tickTypeEnum, outdoorStyleEnum } from '../../constants';
import { toggleMobileNav } from '../../states';
import { useDispatch } from '../../components/State';
import TextAreaField from '../../components/TextAreaField';
import SelectField from '../../components/SelectField';
import TextField from '../../components/TextField';
import SliderField from '../../components/SliderField';
import camelCaseToTitleCase from '../../utils/camelCaseToTitleCase';

const validationSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(
      tickTypeEnum,
      'Please choose a type that describes your performance on this climb',
    )
    .when('style', {
      is: (val) => outdoorStyleEnum.includes(val),
      then: yup.string().required(),
    }),
  style: yup
    .string()
    .required()
    .oneOf(tickStyleEnum, 'Please choose a style'),
  routeId: yup.string(),
  notes: yup.string().max(2000),
  tickDate: yup
    .date('Please choose a date')
    .required('Please choose a date')
    .typeError('Please choose a date')
    .max(
      new Date(),
      `You can't log a climb in the future! Gotta climb it first! This is why the purists hate on us.`,
    ),
  physicalRating: yup.number().nullable(),
  gymName: yup.string().max(500),
  location: yup.string(),
});

const tickStyleOptions = tickStyleEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const tickTypeOptions = tickTypeEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const TickForm = ({ defaultValues, onSubmit, mapDefaultCenter }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  const formMethods = useForm({ validationSchema, defaultValues });
  const { watch } = formMethods;

  const style = watch('style');

  const isOutdoor = outdoorStyleEnum.includes(style);

  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
    >
      <Box d="flex" justifyContent="space-between" flexWrap="wrap">
        <SelectField
          name="style"
          label="Style"
          options={tickStyleOptions}
          required
          helperText="What kind of climbing or workout did you do?"
        />
        <TextField
          name="tickDate"
          type="datetime-local"
          required
          label="Date &amp; Time"
        />
        {isOutdoor && (
          <>
            <SelectField
              name="type"
              label="Did you send?"
              options={tickTypeOptions}
              helperText="Select a type that describes your accomplishment or failure"
            />
            <Map containerStyleProps={{ mb: 5 }} center={mapDefaultCenter} />
          </>
        )}
        {style === 'gym' && <TextField name="gymName" label="Gym Name" />}
      </Box>
      <SliderField
        name="physicalRating"
        label="Physical Rating"
        helperText="Rate how you felt on this climb. How difficult was this climb for you?"
      />
      <TextAreaField
        name="notes"
        label="Notes"
        helperText="Beta, or other noteworthy details about the climb for future reference."
      />
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

export default TickForm;
