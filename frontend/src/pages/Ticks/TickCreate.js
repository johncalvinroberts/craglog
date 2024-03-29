import React from 'react';
import { useToast } from '@chakra-ui/core';
import { mutate } from 'swr';
import { useHistory } from 'react-router-dom';
import format from 'date-fns/format';
import { DATE_INPUT_FORMAT } from '../../constants';
import http from '../../http';
import useTitle from '../../hooks/useTitle';
import { getErrorMessage } from '../../utils';
import TickForm from './TickForm';

const defaultValues = {
  type: 'redpoint',
  style: 'sport',
  routeId: null,
  notes: '',
  tickDate: format(new Date(), DATE_INPUT_FORMAT),
  physicalRating: null,
  gymName: '',
  location: '',
  routeSnapshot: {
    externalUrl: '',
    area: '',
    bolts: 0,
    cragName: '',
    grade: '',
    height: '',
    location: '',
    name: '',
    region: '',
    style: '',
  },
};

const LogCreate = () => {
  useTitle('Add Log');
  const toast = useToast();
  const history = useHistory();

  const onSubmit = async (values) => {
    try {
      const res = await http.post('/tick', values);
      toast({ description: 'Sequence created' });
      mutate(`/tick/${res.id}`, res);
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
