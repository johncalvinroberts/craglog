import React from 'react';
import SequenceForm from './SequenceForm';
import { boards } from '@/constants';

const defaultValues = {
  sequence: [],
  boardName: boards[0].value,
  name: '',
  description: '',
};

const SequenceCreate = () => {
  const onSubmit = (formValues) => console.log({ formValues });
  return <SequenceForm defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default SequenceCreate;
