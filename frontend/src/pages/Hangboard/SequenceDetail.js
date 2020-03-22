import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Spinner, useToast, Box, Heading } from '@chakra-ui/core';
import useSWR from 'swr';
import { useTitle, useCountdown } from '@/hooks';
import { getErrorMessage } from '@/utils';
import { hangBoardMap } from '@/components/hangboards';
import http from '@/http';
import PseudoButton from '@/components/PseudoButton';
import { useDispatch } from '@/components/State';
import { toggleMobileNav } from '@/states';

const BottomButton = ({ children, ...props }) => (
  <PseudoButton
    position="fixed"
    bottom="0"
    left={[0, null, '18rem']}
    right="0"
    width={['100%', '100%', 'calc(100vw - 18rem)']}
    justifyContent="center"
    alignItems="center"
    height="3rem"
    _hover={{
      backgroundColor: 'teal.400',
    }}
    backgroundColor="teal.300"
    fontWeight="600"
    {...props}
  >
    {children}
  </PseudoButton>
);

const SequenceDetailInner = ({ data }) => {
  const [isRunning, setIsRunning] = useState(false);
  const { countdown, start } = useCountdown();

  const Hangboard = useMemo(() => {
    if (!data) return <></>;
    return hangBoardMap[data.boardName] || <></>;
  }, [data]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    start(10000);
  }, [start]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  return (
    <Box d="flex" justifyContent="center" width="100%" flexWrap="wrap">
      <Box flex="0 0 100%" px={1} py={2}>
        <Hangboard viewBox="0 0 781 277" />
      </Box>
      <Box flex="0 0 100%">
        <Heading fontSize="16rem" textAlign="center">
          {countdown}
        </Heading>
      </Box>
      {!isRunning && <BottomButton onClick={handleStart}>START</BottomButton>}
      {isRunning && (
        <BottomButton
          onClick={handlePause}
          backgroundColor="yellow.400"
          _hover={{
            backgroundColor: 'yellow.500',
          }}
        >
          PAUSE
        </BottomButton>
      )}
    </Box>
  );
};

const SequenceDetail = ({ match }) => {
  const { params: { id } = {} } = match;
  const toast = useToast();
  const { data, error } = useSWR(`/hangboard-sequence/${id}`, http.get);
  const dispatch = useDispatch();

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

  // toggle mobile nav on mount/unmount
  useEffect(() => {
    dispatch(toggleMobileNav(false));
    return () => dispatch(toggleMobileNav(true));
  }, [dispatch]);

  if (!data) return <Spinner />;

  return (
    <Box d="flex" flexDirection="column">
      <SequenceDetailInner data={data} />
    </Box>
  );
};

export default SequenceDetail;
