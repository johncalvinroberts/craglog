import React from 'react';
import { Box } from '@chakra-ui/core';
import { useRouteChanged } from '../hooks';
import DashboardHeader from './DashboardHeader';
import SideNav from './SideNav';
import MobileNav from './MobileNav';

const Main = (props) => <Box as="main" mx="auto" mb="3rem" {...props} />;

const Dashboard = ({ children }) => {
  useRouteChanged(() => window.scrollTo(0, 0));

  return (
    <Box minH="100vh" pt="4rem">
      <DashboardHeader />
      <SideNav
        display={['none', null, 'block']}
        maxWidth="18rem"
        width="full"
      />
      <MobileNav />
      <Box pl={[0, null, '18rem']}>
        <Main>{children}</Main>
      </Box>
    </Box>
  );
};

export default Dashboard;
