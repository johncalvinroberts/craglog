import React from 'react';
import { useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import SequenceForm from './SequenceForm';
import { boards } from '@/constants';
import http from '@/http';
import { getErrorMessage } from '@/utils';

export const sequenceItemDefaultValue = {
  rest: 10,
  duration: 0,
  repetitions: 0,
  exercise: '',
  activeHolds: [],
  customExerciseName: '',
};
const defaultValues = {
  sequence: [sequenceItemDefaultValue],
  boardName: boards[0].value,
  name: '',
  description: '',
};

const SequenceCreate = () => {
  const toast = useToast();
  const history = useHistory();

  const onSubmit = async (values) => {
    try {
      await http.post('/hangboard-sequence', values);
      toast({ description: 'Hangboard sequence created :)' });
      history.replace('/app/hangboard');
    } catch (error) {
      toast({
        description: getErrorMessage(error),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return <SequenceForm defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default SequenceCreate;
