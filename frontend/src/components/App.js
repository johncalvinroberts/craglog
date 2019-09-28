import React from 'react';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import theme from '../theme';

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <div>heyy darling</div>
    </ThemeProvider>
  );
};
