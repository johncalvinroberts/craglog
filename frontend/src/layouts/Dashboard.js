import React from 'react';
import { Box } from '@chakra-ui/core';
import DashboardHeader from '../components/DashboardHeader';

const Main = (props) => <Box as="main" mx="auto" mb="3rem" {...props} />;

const Dashboard = ({ children }) => {
  return (
    <Box minH="100vh">
      <DashboardHeader />
      <Main>{children}</Main>
    </Box>
  );
};

export default Dashboard;
