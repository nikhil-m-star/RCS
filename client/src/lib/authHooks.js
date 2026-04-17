import { useContext } from 'react';
import { AuthContext } from './authShared.js';

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}

export function useUser() {
  const ctx = useAuth();
  return {
    user: ctx.user,
    isLoaded: ctx.isLoaded,
  };
}
