import React from 'react';
import ReactDOM from 'react-dom';
import Guu from 'guu';
import App from './components/App';

const log = new Guu('index.js', 'blueviolet');

const rootElement = document.getElementById('root');
const isProduction = process.env.NODE_ENV === 'production';
const isPrerenderPhase = navigator.userAgent === 'ReactSnap';

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<App />, rootElement);
} else {
  ReactDOM.render(<App />, rootElement);
}

const mountServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const sw = await navigator.serviceWorker.register('./service-worker.js', {
        scope: '/',
      });
      log.info('Service Worker registered.');
      log.info(sw);
    } catch (error) {
      log.error('Error registering the Service Worker.', error);
    }
  }
};

if (isProduction && !isPrerenderPhase) {
  window.__MOUNT_FATHOM = true;
  mountServiceWorker();
}
