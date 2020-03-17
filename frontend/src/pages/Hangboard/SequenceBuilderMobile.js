import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/core';
import { AddButton } from './SequenceBuilder';

const SequenceBuilderMobile = () => {
  const handleAdd = useCallback(() => {}, []);

  return (
    <Box borderWidth="1px" d="flex">
      <AddButton handleAdd={handleAdd} width="100%" />
    </Box>
  );
};

export default SequenceBuilderMobile;
