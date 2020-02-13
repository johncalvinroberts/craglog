import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Form from '@/components/Form';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
});

const SequenceForm = ({ defaultValues, onSubmit }) => {
  const formMethods = useForm({ defaultValues, validationSchema });
  return (
    <Form
      onSubmit={onSubmit}
      methods={formMethods}
      defaultValues={defaultValues}
    >
      yo
    </Form>
  );
};

export default SequenceForm;
