import React, { useCallback } from 'react';
import { mutate } from 'swr';
import { useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import { boards } from '@/constants';
import http from '@/http';
import { useTitle } from '@/hooks';
import { getErrorMessage } from '@/utils';
import SequenceForm from './SequenceForm';

export const sequenceItemDefaultValue = {
  rest: 0,
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
  useTitle('Create Sequence');

  const onSubmit = useCallback(
    async (values) => {
      try {
        const res = await http.post('/hangboard-sequence', values);
        toast({ description: 'Hangboard sequence created' });
        mutate(`/hangboard-sequence/${res.id}`, res, false);
        history.replace('/app/hangboard');
      } catch (error) {
        toast({
          description: getErrorMessage(error),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    [history, toast],
  );
  return <SequenceForm defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default SequenceCreate;
