import React from 'react';
import { Box } from '@chakra-ui/core';

const DashboardWrapper = ({ children }) => {
  return (
    <Box maxWidth="46rem" py={5} px={5}>
      {children}
    </Box>
  );
};

export default DashboardWrapper;
