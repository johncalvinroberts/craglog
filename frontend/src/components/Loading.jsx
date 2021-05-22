import React, { useEffect, useState } from 'react';
import { Progress, Box } from '@chakra-ui/core';

const Loading = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(value + 2);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <Box pos="fixed" zIndex="10" top="0" left="0" right="0">
      <Progress color="pink" size="sm" value={value} />
    </Box>
  );
};

export default Loading;
