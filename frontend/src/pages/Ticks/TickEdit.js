import React, { useEffect, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
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

const LogEdit = ({ match }) => {
  const { params: { id } = {} } = match;

  const toast = useToast();
  const history = useHistory();

  useTitle(`Edit Log`);

  const { data, error } = useSWR(`/tick/${id}`, http.get);

  useEffect(() => {
    if (error) {
      toast({
        status: 'error',
        isClosable: true,
        description: getErrorMessage(error),
      });
    }
  }, [error, toast]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        const res = await http.patch(`/tick/${id}`, values);
        toast({ description: 'Log Updated' });
        history.replace('/app');
        mutate(`/tick/${id}`, res);
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

  if (!data) {
    return <Loading />;
  }

  return <TickForm onSubmit={onSubmit} defaultValues={normalize(data)} />;
};

export default LogEdit;
