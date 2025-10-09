import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  const broadcastIntegrityAlert = (detail) => {
    window.dispatchEvent(
      new CustomEvent('service-worker-integrity-alert', { detail })
    );
  };

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'INTEGRITY_ERROR') {
      broadcastIntegrityAlert(event.data);
      if (import.meta.env.DEV) {
        console.error('Asset integrity verification failed', event.data);
      }
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Service worker registration failed', error);
        }
      });
  });
}
