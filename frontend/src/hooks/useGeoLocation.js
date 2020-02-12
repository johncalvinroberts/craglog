import { useEffect, useState } from 'react';
import { fallbackPosition } from '@/constants';

const fallBackLocation = {
  coords: {
    latitude: fallbackPosition[0],
    longitude: fallbackPosition[1],
  },
};

const useGeoLocation = () => {
  const [position, setPosition] = useState(fallBackLocation);
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
        }
      },
    );

    return () => {
      canceled = true;
    };
  }, []);

  return [position, error];
};

export default useGeoLocation;
