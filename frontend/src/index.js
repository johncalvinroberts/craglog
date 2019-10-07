import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));

// eslint-disable-next-line
process.env.NODE_ENV !== 'production' && module.hot.accept();
