import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';  // optional, create empty file if not exists

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
