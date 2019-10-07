import React from 'react';
import { Box } from '@chakra-ui/core';
import { Link } from 'react-router-dom';
import { Dashboard } from '@/layouts';
import useLayout from '@/hooks/useLayout';
import useTitle from '@/hooks/useTitle';

const Home = () => {
  useLayout(Dashboard);
  useTitle('Dashboard');
  return (
    <Box maxWidth="46rem" pt={8} px={5}>
      <Link to="/login">login</Link>
      <Link to="/register">register</Link>
    </Box>
  );
};

export default Home;
