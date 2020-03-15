import React, { useEffect } from 'react';
import { Spinner, useToast } from '@chakra-ui/core';
import useSWR from 'swr';
import { useTitle } from '@/hooks';
import { getErrorMessage } from '@/utils';

import http from '@/http';

const SequenceDetail = ({ match }) => {
  const { params: { id } = {} } = match;
  const toast = useToast();
  const { data, error } = useSWR(`/hangboard-sequence/${id}`, http.get);

  useTitle(data ? data.name : '');

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

  if (!data) return <Spinner />;
  return <div>youpe</div>;
};

export default SequenceDetail;
