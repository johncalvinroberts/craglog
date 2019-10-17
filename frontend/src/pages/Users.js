import React from 'react';
import { Icon } from '@chakra-ui/core';
import DashboardWrapper from '@/components/DashboardWrapper';
import useTitle from '@/hooks/useTitle';

const Users = () => {
  useTitle(
    <>
      admin <Icon name="chevron-right" /> Users
    </>,
  );

  return <DashboardWrapper>users</DashboardWrapper>;
};

export default Users;
