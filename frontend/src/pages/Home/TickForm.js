import React, { useEffect } from 'react';
import { Button, Box } from '@chakra-ui/core';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Form from '../../components/Form';
import { tickStyleEnum, tickTypeEnum, outdoorStyleEnum } from '../../constants';
import { toggleMobileNav } from '../../states';
import { useDispatch } from '../../components/State';
import TextAreaField from '../../components/TextAreaField';
import SelectField from '../../components/SelectField';
import camelCaseToTitleCase from '../../utils/camelCaseToTitleCase';

const validationSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(tickTypeEnum)
    .when('style', {
      is: (val) => outdoorStyleEnum.includes(val),
      then: yup.string().required(),
    }),
  style: yup
    .string()
    .required()
    .oneOf(tickStyleEnum),
  routeId: yup.string(),
  notes: yup.string().max(2000),
  tickDate: yup.date().required(),
  physicalRating: yup.number(),
});

const tickStyleOptions = tickStyleEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const tickTypeOptions = tickTypeEnum.map((item) => ({
  value: item,
  label: camelCaseToTitleCase(item),
}));

const TickForm = ({ defaultValues, onSubmit }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  const formMethods = useForm({ validationSchema, defaultValues });

  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
    >
      <SelectField
        name="style"
        label="Style"
        options={tickStyleOptions}
        helperText="What kind of climbing or workout did you do?"
      />
      <SelectField
        name="type"
        label="Did you send?"
        options={tickTypeOptions}
        helperText="What kind of climbing or workout did you do?"
      />
      <TextAreaField
        name="notes"
        label="Notes"
        helperText="Describe your climb for future reference"
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
