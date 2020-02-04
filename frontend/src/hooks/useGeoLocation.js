import { useEffect, useState } from 'react';
import { fallbackPosition } from '../constants';

const useGeoLocation = (options) => {
  const [position, setPosition] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    let canceled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!canceled) {
          setPosition(position);
        }
      },
      (error) => {
        if (!canceled) {
          setError(error);
          setPosition(fallbackPosition);
        }
      },
      options,
    );

    return () => {
      canceled = true;
    };
  }, [options]);

  return [position, error];
};

export default useGeoLocation;
