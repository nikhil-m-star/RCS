import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './lib/auth.jsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function bootstrap() {
  const app = (
    <React.StrictMode>
      <AuthProvider clerkEnabled={Boolean(PUBLISHABLE_KEY)}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );

  ReactDOM.createRoot(document.getElementById('root')).render(
    PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{app}</ClerkProvider>
    ) : (
      app
    ),
  );
}

bootstrap();
