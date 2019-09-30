import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import useAuthState from '../hooks/useAuthState';
import { notifyError } from '../states/notifications';
import { useDispatch } from './State';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthState();
  const dispatch = useDispatch();
  if (!isAuthenticated) {
    dispatch(notifyError('You are not logged in, doink'));
    return <Redirect to="/login" />;
  }
  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
