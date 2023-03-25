import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.createElement('div');
rootElement.id = 'root-quick-command'
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(
  document.getElementById('root-quick-command') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);