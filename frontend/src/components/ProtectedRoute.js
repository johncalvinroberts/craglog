import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useToast } from '@chakra-ui/core';
import useAuthState from '../hooks/useAuthState';

const ProtectedRoute = ({
  component: Component,
  rolesNeeded = [],
  ...rest
}) => {
  const { isAuthenticated, user } = useAuthState();
  const toast = useToast();

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
  const hasRoles =
    user && rolesNeeded.every((role) => user.roles.includes(role));
  if (!hasRoles) {
    return <Redirect to="/app" />;
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
