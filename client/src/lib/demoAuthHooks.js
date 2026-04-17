import { useContext } from 'react';
import { DemoAuthContext } from './demoAuthShared.js';

export function useDemoAuth() {
  const ctx = useContext(DemoAuthContext);
  return {
    userId: ctx?.userId || null,
    getToken: ctx?.getToken || (async () => 'demo-token'),
    isSignedIn: ctx?.signedIn || false,
  };
}

export function useDemoUser() {
  const ctx = useContext(DemoAuthContext);
  return {
    user: ctx?.user || null,
    isLoaded: true,
  };
}
