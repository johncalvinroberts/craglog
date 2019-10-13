import React from 'react';
import { Dashboard } from '@/layouts';
import useLayout from '@/hooks/useLayout';
import useTitle from '@/hooks/useTitle';
import DashboardWrapper from '@/components/DashboardWrapper';

const Home = () => {
  useLayout(Dashboard);
  useTitle('Dashboard');
  return <DashboardWrapper>stuff here</DashboardWrapper>;
};

export default Home;
