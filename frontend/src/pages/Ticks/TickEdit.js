import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import format from 'date-fns/format';
import useTitle from '@/hooks/useTitle';
import http from '@/http';
import Loading from '@/components/Loading';
import getErrorMessage from '@/utils/getErrorMessage';
import { DATE_INPUT_FORMAT } from '@/constants';
import TickForm from './TickForm';

const normalize = (tick) => {
  const { route, tickDate, ...rest } = tick;
  return {
    ...rest,
    routeId: route ? route.id : null,
    tickDate: format(new Date(tickDate), DATE_INPUT_FORMAT),
  };
};

const LogEdit = ({ match, location }) => {
  const { params: { id } = {} } = match;
  const { item } = location;
  const initialValue = item ? normalize(item) : null;
  const [defaultValues, setDefaultValues] = useState(initialValue);

  const toast = useToast();
  const history = useHistory();

  useTitle(`Edit Log`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http.get(`/tick/${id}`);
        setDefaultValues(normalize(res));
      } catch (error) {
        toast({
          status: 'error',
          isClosable: true,
          description: getErrorMessage(error),
        });
      }
    };

    if (!defaultValues) {
      fetchData();
    }
  }, []); //eslint-disable-line

  const onSubmit = useCallback(
    async (values) => {
      try {
        await http.patch(`/tick/${id}`, values);
        toast({ description: 'Log Updated :)' });
        history.replace('/app');
      } catch (error) {
        toast({
          description: getErrorMessage(error),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    },
    [history, id, toast],
  );

  if (!defaultValues) {
    return <Loading />;
  }

  return <TickForm onSubmit={onSubmit} defaultValues={defaultValues} />;
};

export default LogEdit;
