import React from 'react';
import { Box } from '@chakra-ui/core';

const DashboardWrapper = ({ children }) => {
  return (
    <Box maxWidth="46rem" px={5} py={4} margin="0 auto">
      {children}
    </Box>
  );
};

export default DashboardWrapper;
