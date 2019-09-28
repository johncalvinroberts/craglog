import React from 'react';
import useLayout from '../hooks/useLayout';
import LoginLayout from '../layouts/LogIn';

const LogIn = () => {
  useLayout(LoginLayout);
  return <div>login hehe</div>;
};

export default LogIn;
