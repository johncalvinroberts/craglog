import React, { useEffect, useState, useRef } from 'react';
import { Spinner, useToast, Box, Heading } from '@chakra-ui/core';
import useSWR from 'swr';
import { useTitle, useCountdown } from '@/hooks';
import { getErrorMessage, formatMs, getUuidV4 } from '@/utils';
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

// this is the initial rest, should update this to account for a config/setting
const initialStackEntry = {
  duration: 1000,
  interval: REST_MS_INTERVAL,
  id: getUuidV4(),
};

const normalizeSequenceToStack = (sequence) => {
  return sequence.reduce((memo, current) => {
    const id = getUuidV4();
    if (current.duration) {
      memo.push({
        ...current,
        duration: current.duration * 1000,
        interval: EXERCISE_MS_INTERVAL,
        id,
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
        id,
      });
    }
    return memo;
  }, []);
};
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const SequenceDetailInner = ({ data, Hangboard }) => {
  const [isRunning, setIsRunning] = useState(false);

  const [stack, setStack] = useState([
    initialStackEntry,
    ...normalizeSequenceToStack(data.sequence),
  ]);

  const stackRef = useRef();
  const isRunningRef = useRef();
  const [currentItem, setCurrentItem] = useState(stack[0]);
  const { timeRemaining, start, reset, expire } = useCountdown();

  const handleStart = async () => {
    setIsRunning(true);
    isRunningRef.current = true;
    for (const item of stack) {
      setCurrentItem(item);
      if (!isRunningRef.current) break;
      await start(item.duration, item.interval);
      const [, ...nextStack] = stackRef.current;
      setStack(nextStack);
      reset();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    const [, ...endOfNextStack] = stackRef.current;
    const nextHeadItem = { ...currentItem, duration: timeRemaining };
    setStack([nextHeadItem, ...endOfNextStack]);
    expire();
  };

  const handleRestart = () => {
    const nextStack = [
      initialStackEntry,
      ...normalizeSequenceToStack(data.sequence),
    ];
    setStack(nextStack);
    setCurrentItem(nextStack[0]);
    handleStart();
  };

  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    if (stack.length === 0) {
      setCurrentItem(undefined);
      expire();
      reset();
      setIsRunning(false);
    }
  }, [stack, expire, reset]);

  const isRest = currentItem && currentItem.interval !== EXERCISE_MS_INTERVAL;
  const isDone = !isRunning && !currentItem;

  return (
    <Box d="flex" justifyContent="center" width="100%" flexWrap="wrap">
      <Box flex="0 0 100%" px={1} py={2}>
        <Hangboard viewBox="0 0 781 277" />
      </Box>
      <Box flex="0 0 100%">
        {isRunning && (
          <Heading fontSize="14rem" textAlign="center">
            {formatMs(timeRemaining, {
              milliseconds: !isRest,
            })}
          </Heading>
        )}
        {!isRunning && stack.length > 0 && (
          <Heading fontSize="14rem" textAlign="center">
            {formatMs(stack[0].duration, {
              milliseconds: !isRest,
            })}
          </Heading>
        )}
        <Box textAlign="center">{isRest && 'rest'}</Box>
      </Box>
      {!isRunning && <BottomButton onClick={handleStart}>START</BottomButton>}
      {isRunning && !isDone && (
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
      {isDone && (
        <>
          <Heading fontSize="14rem" textAlign="center">
            DONE. Good Job.
          </Heading>
          <BottomButton onClick={handleRestart}>Restart</BottomButton>
        </>
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
  const Hangboard = hangBoardMap[data.boardName] || <></>;
  return (
    <Box d="flex" flexDirection="column">
      <SequenceDetailInner data={data} Hangboard={Hangboard} />
    </Box>
  );
};

export default SequenceDetail;
