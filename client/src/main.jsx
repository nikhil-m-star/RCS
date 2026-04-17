import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isDemoMode = !PUBLISHABLE_KEY;

async function bootstrap() {
  let Provider;
  let providerProps = {};

  if (isDemoMode) {
    console.log('[Footprints] No Clerk key found — running in demo mode');
    const { DemoAuthProvider } = await import('./lib/DemoProvider.jsx');
    Provider = DemoAuthProvider;
  } else {
    const { ClerkProvider } = await import('@clerk/clerk-react');
    Provider = ClerkProvider;
    providerProps = { publishableKey: PUBLISHABLE_KEY };
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Provider {...providerProps}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();
