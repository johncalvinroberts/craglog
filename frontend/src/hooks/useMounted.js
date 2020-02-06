import { useEffect, useRef } from 'react';

/**
 * Usage:
 *
 * ```js
 * const isMountedRef = useMounted();
 *
 * // After some async actions (the component might've been unmounted)
 * if (isMountedRef.current) setXxx(false);
 * ```
 */
const useMounted = (initialIsMounted = true) => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const isMountedRef = useRef(initialIsMounted);

  useEffect(
    () => () => {
      // When unmounting, change current isMounted to false
      isMountedRef.current = false;
    },
    [initialIsMounted],
  );

  // Return the container, when we use it we check its current
  return isMountedRef.current;
};
export default useMounted;
