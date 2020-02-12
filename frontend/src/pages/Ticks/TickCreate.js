import React from 'react';
import { useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import format from 'date-fns/format';
import TickForm from './TickForm';
import useTitle from '@/hooks/useTitle';
import http from '@/http';
import { DATE_INPUT_FORMAT } from '@/constants';
import getErrorMessage from '@/utils/getErrorMessage';

const defaultValues = {
  type: 'redpoint',
  style: 'sport',
  routeId: null,
  notes: '',
  tickDate: format(new Date(), DATE_INPUT_FORMAT),
  physicalRating: null,
  gymName: '',
  location: '',
};

const LogCreate = () => {
  useTitle('Add Log');
  const toast = useToast();
  const history = useHistory();

  const onSubmit = async (values) => {
    try {
      await http.post('/tick', values);
      toast({ description: 'Log created :)' });
      history.replace('/app');
    } catch (error) {
      toast({
        description: getErrorMessage(error),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return <TickForm onSubmit={onSubmit} defaultValues={defaultValues} />;
};

export default LogCreate;
