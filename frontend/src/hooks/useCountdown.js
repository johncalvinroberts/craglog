import { useCallback, useEffect, useRef, useState } from 'react';
import { delay } from '../utils';

export default () => {
  const [timeRemaining, setTimeRemaining] = useState();
  const [canStart, setCanStart] = useState();
  const [updateInterval, setUpdateInterval] = useState();
  const intervalRef = useRef();

  const timeRemainingRef = useRef();

  const start = async (durationMs, interval = 1000) => {
    setCanStart(true);
    setUpdateInterval(interval);
    setTimeRemaining(durationMs);
    timeRemainingRef.current = durationMs;
    await delay(durationMs);
  };

  const reset = useCallback(() => {
    setCanStart(false);
    setTimeRemaining(0);
  }, [setCanStart, setTimeRemaining]);

  const expire = useCallback(() => {
    setCanStart(false);
    setTimeRemaining(0);
    clearInterval(intervalRef.current);
  }, [setCanStart, setTimeRemaining]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    const tick = () => {
      if (timeRemainingRef.current / 1000 <= 0) {
        expire();
      } else {
        setTimeRemaining((prev) => prev - updateInterval);
      }
    };

    if (canStart) {
      intervalRef.current = setInterval(tick, updateInterval);
    }
    return () => clearInterval(intervalRef.current);
  }, [expire, canStart, updateInterval]);

  return {
    timeRemaining,
    start,
    reset,
    expire,
  };
};
