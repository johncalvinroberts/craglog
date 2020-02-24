import { useEffect } from 'react';
import { useLocation } from 'react-router';

export default (callback) => {
  const location = useLocation();
  useEffect(() => {
    const handleRouteChange = ({ pathname }) => {
      callback();
      console.log('App is changing to: ', pathname); //eslint-disable-line
    };
    handleRouteChange(location);
  }, [callback, location]);
};
