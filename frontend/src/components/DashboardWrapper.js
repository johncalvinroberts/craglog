import React from 'react';
import { Box } from '@chakra-ui/core';

const DashboardWrapper = ({ children }) => {
  return (
    <Box maxWidth="46rem" pt={8} px={5}>
      {children}
    </Box>
  );
};

export default DashboardWrapper;
