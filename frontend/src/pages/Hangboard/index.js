import React from 'react';
import useTitle from '../../hooks/useTitle';
import DashboardWrapper from '../../components/DashboardWrapper';

const Home = () => {
  useTitle('Hangboard');
  return <DashboardWrapper>Hang thyme</DashboardWrapper>;
};

export default Home;
