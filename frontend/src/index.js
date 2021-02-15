import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';

import App from './components/App';
import theme from './theme';

ReactDOM.render(
  <React.StrictMode>
    <CSSReset />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
