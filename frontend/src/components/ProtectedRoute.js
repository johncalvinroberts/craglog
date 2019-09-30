import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useToast } from '@chakra-ui/core';
import useAuthState from '../hooks/useAuthState';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthState();
  const toast = useToast();
  // TODO: protect based on roles
  if (!isAuthenticated) {
    toast({
      title: 'Please login first.',
      description: 'You need to login before proceeding',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });
    return <Redirect to="/login" />;
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
