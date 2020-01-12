import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/core';
import DashboardWrapper from '../components/DashboardWrapper';
import { useDispatch, useGlobalState } from '../components/State';
import useTitle from '../hooks/useTitle';
import { getUsers } from '../states/users';

const Users = () => {
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Users
    </>,
  );
  const dispatch = useDispatch();

  const state = useGlobalState();

  console.log(state);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return <DashboardWrapper>users</DashboardWrapper>;
};

export default Users;
