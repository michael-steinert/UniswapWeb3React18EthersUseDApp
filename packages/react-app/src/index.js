import React from 'react';
import ReactDOM from 'react-dom/client';
import { DAppProvider } from '@usedapp/core';

import App from './App';
import { DAPP_CONFIG } from './config';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <DAppProvider config={DAPP_CONFIG}>
      <App />
    </DAppProvider>
  </React.StrictMode>
);
