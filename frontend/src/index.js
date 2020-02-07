import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));

// eslint-disable-next-line
process.env.NODE_ENV !== 'production' && module.hot.accept();

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration); //eslint-disable-line
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError); //eslint-disable-line
      });
  });
}
