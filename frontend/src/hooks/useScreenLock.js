import { useEffect, useRef } from 'react';

const useScreenLock = () => {
  const lockRef = useRef();
  useEffect(() => {
    const init = async () => {
      try {
        lockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        // Error or rejection
        // eslint-disable-next-line
        console.log('Wake Lock error: ', err);
      }
    };
    init();
    return () => {
      if (lockRef.current) {
        lockRef.current.release();
      }
    };
  }, []);
};

export default useScreenLock;
