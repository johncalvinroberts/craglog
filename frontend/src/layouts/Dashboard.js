import React from 'react';
import { Box } from '@chakra-ui/core';
import DashboardHeader from '@/components/DashboardHeader';
import SideNav from '@/components/SideNav';

const Main = (props) => <Box as="main" mx="auto" mb="3rem" {...props} />;

const Dashboard = ({ children }) => {
  return (
    <Box minH="100vh" pt="4rem">
      <DashboardHeader />
      <SideNav
        display={['none', null, 'block']}
        maxWidth="18rem"
        width="full"
      />
      <Box pl={[0, null, '18rem']}>
        <Main>{children}</Main>
      </Box>
    </Box>
  );
};

export default Dashboard;
