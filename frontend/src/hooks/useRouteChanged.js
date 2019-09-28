import { useEffect } from 'react';
import { useLocation } from 'react-router';

const useRouteChanged = (callback) => {
  const location = useLocation();
  useEffect(() => {
    const handleRouteChange = (url) => {
      callback();
      console.log('App is changing to: ', url); //eslint-disable-line
    };
    handleRouteChange();
  }, [location, callback]);
};

export default useRouteChanged;
