import { useCallback, useEffect, useRef, useState } from 'react';

export default ({ onExpire, onReset } = {}) => {
  const [timeRemaining, setTimeRemaining] = useState();
  const [canStart, setCanStart] = useState();
  const [updateInterval, setUpdateInterval] = useState();

  const timeRemainingRef = useRef();

  const start = useCallback((durationMs, interval = 1000) => {
    setCanStart(true);
    setUpdateInterval(interval);
    setTimeRemaining(durationMs);
    timeRemainingRef.current = durationMs;
  }, []);

  const reset = useCallback(() => {
    setCanStart(false);
    setTimeRemaining(null);
    if (onReset && typeof onReset === 'function') {
      onReset();
    }
  }, [onReset]);

  const expire = useCallback(() => {
    setCanStart(false);
    setTimeRemaining(0);
    if (onExpire && typeof onExpire === 'function') {
      onExpire();
    }
  }, [onExpire]);

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

    let id;
    if (canStart) {
      id = setInterval(tick, updateInterval);
    }
    return () => clearInterval(id);
  }, [expire, canStart, updateInterval]);

  return {
    timeRemaining,
    start,
    reset,
  };
};
