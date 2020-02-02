import React from 'react';
import useTitle from '../../hooks/useTitle';
import DashboardWrapper from '../../components/DashboardWrapper';

const Home = () => {
  useTitle('Craglog');
  return <DashboardWrapper>stuff here</DashboardWrapper>;
};

export default Home;
