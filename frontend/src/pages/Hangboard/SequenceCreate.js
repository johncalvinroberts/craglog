import React from 'react';
import SequenceForm from './SequenceForm';
import { boards } from '@/constants';

export const sequenceItemDefaultValue = {
  rest: 0,
  duration: 0,
  repetitions: 0,
  activeHolds: [],
  exercise: '',
};
const defaultValues = {
  sequence: [sequenceItemDefaultValue],
  boardName: boards[0].value,
  name: '',
  description: '',
};

const SequenceCreate = () => {
  const onSubmit = (formValues) => console.log({ formValues });
  return <SequenceForm defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default SequenceCreate;
