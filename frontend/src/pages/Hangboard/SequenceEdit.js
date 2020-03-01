import React, { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useToast, Spinner } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import SequenceForm from './SequenceForm';
import http from '@/http';
import useTitle from '@/hooks/useTitle';
import { getErrorMessage } from '@/utils';

const SequenceEdit = ({ match }) => {
  const { params: { id } = {} } = match;
  const toast = useToast();
  const history = useHistory();

  useTitle(`Edit Hangboard Sequence`);
  const { data, error } = useSWR(`/hangboard-sequence/${id}`, http.get);

  useEffect(() => {
    if (error) {
      toast({
        description: getErrorMessage(error),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        await http.patch(`/hangboard-sequence/${id}`, values);
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
    },
    [history, id, toast],
  );

  if (!data) return <Spinner />;

  return <SequenceForm defaultValues={data} onSubmit={onSubmit} />;
};

export default SequenceEdit;
