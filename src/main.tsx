import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import './app/styles/globals.css';
import { setupGlobalErrorHandlers } from './core/errors/error-handler';

// Initialize global uncaught error listeners
setupGlobalErrorHandlers();

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
