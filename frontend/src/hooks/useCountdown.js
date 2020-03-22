import { useCallback, useEffect, useRef, useState } from 'react';

export default ({ onExpire, onReset } = {}) => {
  const [countdown, setCountdown] = useState();
  const [canStart, setCanStart] = useState();
  const [updateInterval, setUpdateInterval] = useState();

  const countdownRef = useRef();

  const start = useCallback((durationMs, interval = 1000) => {
    setCanStart(true);
    setUpdateInterval(interval);
    setCountdown(durationMs);
    countdownRef.current = durationMs;
  }, []);

  const reset = useCallback(() => {
    setCanStart(false);
    setCountdown(null);
    if (onReset && typeof onReset === 'function') {
      onReset();
    }
  }, [onReset]);

  const expire = useCallback(() => {
    setCanStart(false);
    setCountdown(0);
    if (onExpire && typeof onExpire === 'function') {
      onExpire();
    }
  }, [onExpire]);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    const tick = () => {
      if (countdownRef.current / 1000 <= 0) {
        expire();
      } else {
        setCountdown((prev) => prev - updateInterval);
      }
    };

    let id;
    if (canStart) {
      id = setInterval(tick, updateInterval);
    }
    return () => clearInterval(id);
  }, [expire, canStart, updateInterval]);

  return {
    countdown,
    start,
    reset,
  };
};
