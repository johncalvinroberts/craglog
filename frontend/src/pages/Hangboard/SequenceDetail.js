import React, { useEffect, useState, useRef } from 'react';
import { Spinner, useToast, Box, Heading } from '@chakra-ui/core';
import useSWR, { mutate } from 'swr';
import { hangBoardMap } from '../../components/hangboards';
import PseudoButton from '../../components/PseudoButton';
import http from '../../http';
import { useDispatch } from '../../components/State';
import { toggleMobileNav } from '../../states';
import {
  getErrorMessage,
  formatMs,
  getUuidV4,
  camelCaseToTitleCase,
  calculateSequenceTimeInWords,
} from '../../utils';
import { useTitle, useCountdown, useScreenLock } from '../../hooks';

const REST_MS_INTERVAL = 1000;
const EXERCISE_MS_INTERVAL = 100;

const INTERVAL_LABELS = {
  1000: `s`,
  100: `ms`,
};

const getCurrentItemDisplayText = (item = {}) => {
  const { customExerciseName, exercise } = item;
  if (customExerciseName) return customExerciseName;
  return camelCaseToTitleCase(exercise);
};

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
  duration: 5000,
  interval: REST_MS_INTERVAL,
  id: getUuidV4(),
  stepIndex: 0,
};

const normalizeSequenceToStack = (sequence) => {
  return sequence.reduce((memo, current, index) => {
    const id = getUuidV4();
    const stepIndex = index + 1;
    if (current.duration) {
      memo.push({
        ...current,
        duration: current.duration * 1000,
        interval: EXERCISE_MS_INTERVAL,
        id,
        stepIndex,
      });
    }

    if (current.repetitions) {
      memo.push({
        ...current,
        duration: current.repetitions * 3000, // 3 seconds per rep
        isRepetitions: true,
        interval: REST_MS_INTERVAL,
        id,
        stepIndex,
      });
    }
    // add rest to the stack too
    if (current.rest) {
      memo.push({
        duration: current.rest * 1000,
        interval: REST_MS_INTERVAL,
        isRest: true,
        id,
        stepIndex,
      });
    }
    return memo;
  }, []);
};
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const SequenceDetailInner = ({ data, Hangboard, totalTime, handleDone }) => {
  const [isRunning, setIsRunning] = useState(false);

  const [stack, setStack] = useState([
    initialStackEntry,
    ...normalizeSequenceToStack(data.sequence),
  ]);

  const stackRef = useRef();
  const isRunningRef = useRef();
  const currentItemRef = useRef();

  const [currentItem, setCurrentItem] = useState(stack[0]);
  const [repsRemaining, setRepsRemaining] = useState(0);
  const { timeRemaining, start, reset, expire } = useCountdown();
  useScreenLock();

  const isRest = currentItem && currentItem.isRest;
  const isDone = !isRunning && !currentItem;
  const totalLength = data.sequence && data.sequence.length;

  const handleStart = async () => {
    setIsRunning(true);
    isRunningRef.current = true;
    for (const item of stackRef.current) {
      if (!isRunningRef.current) break;
      setCurrentItem(item);
      await start(item.duration, item.interval);
      const [, ...nextStack] = stackRef.current;
      setStack(nextStack);
      reset();
    }
  };

  const handlePause = () => {
    const [, ...endOfNextStack] = stackRef.current;
    const nextHeadItem = {
      ...currentItemRef.current,
      duration: timeRemaining,
    };
    setStack([nextHeadItem, ...endOfNextStack]);
    setCurrentItem(nextHeadItem);
    setIsRunning(false);
    expire();
  };

  useEffect(() => {
    stackRef.current = stack;
  }, [stack]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    currentItemRef.current = currentItem;
  }, [currentItem]);

  useEffect(() => {
    if (currentItemRef.current && currentItemRef.current.isRepetitions) {
      console.log({ timeRemaining });
      setRepsRemaining(Math.floor(timeRemaining / 3000));
    } else {
      setRepsRemaining(0);
    }
  }, [currentItem, timeRemaining]);

  // end the workout
  useEffect(() => {
    if (stack.length === 0) {
      setCurrentItem(undefined);
      expire();
      reset();
      setIsRunning(false);
    }
  }, [stack, expire, reset]);

  useEffect(() => {
    if (isDone) {
      handleDone({ type: 'workout', style: 'hangboard', tickDate: new Date() });
    }
  }, [isDone, handleDone]);

  console.log({ currentItem });

  return (
    <Box d="flex" justifyContent="center" width="100%" flexWrap="wrap">
      <Box flex="0 0 100%" p={2} display="flex" justifyContent="space-between">
        <Box>
          <Box fontSize="1rem" fontWeight="bold" as="span">
            {data.name}
          </Box>
          , {totalTime}
        </Box>
        <Box>
          {isDone && `${totalLength}/${totalLength}`}
          {!isDone && `${currentItem.stepIndex}/${totalLength}`}
        </Box>
      </Box>
      <Box flex="0 0 100%" px={1} py={2}>
        <Hangboard
          viewBox="0 0 781 277"
          activeHolds={currentItem && currentItem.activeHolds}
        />
      </Box>
      <Box flex="0 0 100%">
        <Box textAlign="center" fontSize="3rem">
          {isRest && 'Rest'}
          {!isRest && !isDone && getCurrentItemDisplayText(currentItem)}
        </Box>
        {isRunning && (
          <Heading fontSize={['6rem', '14rem']} textAlign="center">
            {!currentItem.isRepetitions && (
              <>
                {formatMs(timeRemaining, {
                  milliseconds: !isRest,
                })}
                <Box ml={1} fontSize="14px" display="inline-block">
                  {INTERVAL_LABELS[currentItem.interval]}
                </Box>
              </>
            )}
            {currentItem.isRepetitions && <>{repsRemaining}</>}
          </Heading>
        )}
        {!isRunning && stack.length > 0 && !currentItem.isRepetitions && (
          <Heading fontSize={['6rem', '14rem']} textAlign="center">
            {formatMs(currentItem.duration, {
              milliseconds: !isRest,
            })}
            <Box ml={1} fontSize="14px" display="inline-block">
              {INTERVAL_LABELS[currentItem.interval || INTERVAL_LABELS[100]]}
            </Box>
          </Heading>
        )}
      </Box>
      {!isRunning && !isDone && (
        <BottomButton onClick={handleStart}>START</BottomButton>
      )}
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
          <Heading
            fontSize={['6rem', '10rem']}
            textAlign="center"
            flex="0 0 100%"
          >
            DONE.
          </Heading>
          <Box>Good Job.</Box>
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
  const totalTime = calculateSequenceTimeInWords(data.sequence);

  const handleDone = async (values) => {
    const res = await http.post('/tick', values);
    toast({ description: 'Saved Tick' });
    mutate(`/tick/${res.id}`, res);
  };

  return (
    <Box d="flex" flexDirection="column">
      <SequenceDetailInner
        data={data}
        Hangboard={Hangboard}
        totalTime={totalTime}
        handleDone={handleDone}
      />
    </Box>
  );
};

export default SequenceDetail;
