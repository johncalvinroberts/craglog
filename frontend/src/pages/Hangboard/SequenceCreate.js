import React from 'react';
import SequenceForm from './SequenceForm';

const defaultValues = {};
const SequenceCreate = () => {
  const onSubmit = (formValues) => console.log({ formValues });
  return <SequenceForm defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default SequenceCreate;
