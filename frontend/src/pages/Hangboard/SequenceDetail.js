import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Spinner, useToast, Box, Heading } from '@chakra-ui/core';
import useSWR from 'swr';
import { useTitle, useCountdown } from '@/hooks';
import { getErrorMessage, formatMs } from '@/utils';
import { hangBoardMap } from '@/components/hangboards';
import http from '@/http';
import PseudoButton from '@/components/PseudoButton';
import { useDispatch } from '@/components/State';
import { toggleMobileNav } from '@/states';

const REST_MS_INTERVAL = 1000;
const EXERCISE_MS_INTERVAL = 100;

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

const initialStackEntry = {
  duration: 1000,
  interval: REST_MS_INTERVAL,
};

const normalizeSequenceToStack = (sequence) => {
  return sequence.reduce((memo, current) => {
    if (current.duration) {
      memo.push({
        ...current,
        duration: current.duration * 1000,
        interval: EXERCISE_MS_INTERVAL,
      });
    }

    if (current.repetitions) {
      memo.push(current); // what to do here?
    }
    // add rest to the stack too
    if (current.rest) {
      memo.push({
        duration: current.rest * 1000,
        unit: REST_MS_INTERVAL,
        isRest: true,
      });
    }
    return memo;
  }, []);
};
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const SequenceDetailInner = ({ data }) => {
  const [isRunning, setIsRunning] = useState(false);
  const initialStack = [
    initialStackEntry,
    ...normalizeSequenceToStack(data.sequence),
  ];
  const [stack, setStack] = useState(initialStack);
  const stackRef = useRef();
  const [currentItem, setCurrentItem] = useState(initialStack[0]);
  const { timeRemaining, start, reset, cancel } = useCountdown();

  const Hangboard = useMemo(() => {
    if (!data) return <></>;
    return hangBoardMap[data.boardName] || <></>;
  }, [data]);

  const handleStart = useCallback(async () => {
    setIsRunning(true);

    for (const item of stack) {
      setCurrentItem(item);
      await start(item.duration, item.interval);
      const [, ...nextStack] = stackRef.current;
      setStack(nextStack);
      reset();
    }
  }, [reset, stack, start]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    const [, ...endOfNextStack] = stackRef.current;
    const nextHeadItem = { ...currentItem, duration: timeRemaining };
    setStack([nextHeadItem, ...endOfNextStack]);
    cancel();
  }, [cancel, currentItem, timeRemaining]);

  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);
  console.log({ stack, currentItem });
  return (
    <Box d="flex" justifyContent="center" width="100%" flexWrap="wrap">
      <Box flex="0 0 100%" px={1} py={2}>
        <Hangboard viewBox="0 0 781 277" />
      </Box>
      <Box flex="0 0 100%">
        <Heading fontSize="16rem" textAlign="center">
          {formatMs(timeRemaining, {
            milliseconds: currentItem.interval === EXERCISE_MS_INTERVAL,
          })}
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
