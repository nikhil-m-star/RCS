import { useContext, useState } from 'react';
import { DemoAuthContext, DEMO_USER } from './demoAuthShared.js';

export function DemoAuthProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);

  const contextValue = {
    userId: signedIn ? DEMO_USER.id : null,
    signedIn,
    setSignedIn,
    user: signedIn ? DEMO_USER : null,
    getToken: async () => 'demo-token',
  };

  return (
    <DemoAuthContext.Provider value={contextValue}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function DemoSignedIn({ children }) {
  const ctx = useContext(DemoAuthContext);
  return ctx?.signedIn ? children : null;
}

export function DemoSignedOut({ children }) {
  const ctx = useContext(DemoAuthContext);
  return ctx?.signedIn ? null : children;
}

export function DemoSignInButton({ children }) {
  const ctx = useContext(DemoAuthContext);
  const handleClick = () => {
    ctx?.setSignedIn(true);
    window.location.href = '/dashboard';
  };

  if (children) {
    return <span onClick={handleClick}>{children}</span>;
  }

  return (
    <button onClick={handleClick} style={{ cursor: 'pointer' }}>
      Sign In
    </button>
  );
}

export function DemoUserButton({ afterSignOutUrl }) {
  const ctx = useContext(DemoAuthContext);

  return (
    <button
      onClick={() => {
        ctx?.setSignedIn(false);
        if (afterSignOutUrl) {
          window.location.href = afterSignOutUrl;
        }
      }}
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
      style={{
        background: '#7c3aed',
        color: '#e2e8f0',
        border: '2px solid #a78bfa',
        boxShadow: '0 0 12px rgba(124,58,237,0.3)',
      }}
      title="Sign out"
    >
      W
    </button>
  );
}
