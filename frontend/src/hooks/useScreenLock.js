import { useEffect, useRef } from 'react';
import Guu from 'guu';

const log = new Guu('useScreenLock', 'pink');

const useScreenLock = () => {
  const lockRef = useRef();
  useEffect(() => {
    const init = async () => {
      try {
        log.info('Locking screen');
        lockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) {
        // Error or rejection
        // eslint-disable-next-line
        log.error('Wake Lock error: ', err);
      }
    };
    init();
    return () => {
      if (lockRef.current) {
        log.info('Releasing screen lock');
        lockRef.current.release();
      }
    };
  }, []);
};

export default useScreenLock;
