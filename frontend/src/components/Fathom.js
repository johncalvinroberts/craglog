import React from 'react';
import { useRouteChanged } from '../hooks';

const Fathom = () => {
  useRouteChanged(() => window.fathom && window.fathom('trackPageview'));
  return <></>;
};

export default Fathom;
