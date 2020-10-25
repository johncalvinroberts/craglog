import React, { useEffect, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import { useToast, Spinner } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';
import http from '@/http';
import useTitle from '@/hooks/useTitle';
import { getErrorMessage } from '@/utils';
import SequenceForm from './SequenceForm';

const SequenceEdit = ({ match }) => {
  const { params: { id } = {} } = match;
  const toast = useToast();
  const history = useHistory();

  useTitle(`Edit Sequence`);
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
        const res = await http.patch(`/hangboard-sequence/${id}`, values);
        toast({ description: 'Hangboard sequence updated' });
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
    [history, id, toast],
  );

  if (!data) return <Spinner />;

  return <SequenceForm defaultValues={data} onSubmit={onSubmit} />;
};

export default SequenceEdit;
