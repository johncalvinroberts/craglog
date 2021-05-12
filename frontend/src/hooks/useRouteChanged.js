import { useEffect } from 'react';
import { useLocation } from 'react-router';
import Guu from 'guu';

const log = new Guu('useRouteChanged', 'salmon');

export default (callback) => {
  const location = useLocation();
  useEffect(() => {
    const handleRouteChange = ({ pathname }) => {
      callback();
      log.info('App is changing to: ', pathname);
    };
    handleRouteChange(location);
  }, [callback, location]);
};
