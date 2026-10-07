import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { prefetchEventsOnAppBoot } from './db/neonService.js';

// Wake up Neon DB and populate events cache ASAP — before React renders.
// On cold start this buys ~10-15 seconds of head start so the Events page
// loads from a warm cache instead of waiting for a cold DB connection.
prefetchEventsOnAppBoot();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
