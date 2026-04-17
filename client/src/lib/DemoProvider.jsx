import { createContext, useContext, useState } from 'react';

// Demo auth context — used when Clerk keys are not configured
const DemoAuthContext = createContext(null);

const DEMO_USER = {
  id: 'demo_user_001',
  firstName: 'Wanderer',
  username: 'wanderer',
  imageUrl: null,
};

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

// Mock hooks that mirror Clerk's API
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

// Mock components
export function DemoSignedIn({ children }) {
  const ctx = useContext(DemoAuthContext);
  return ctx?.signedIn ? children : null;
}

export function DemoSignedOut({ children }) {
  const ctx = useContext(DemoAuthContext);
  return ctx?.signedIn ? null : children;
}

export function DemoSignInButton({ children, mode }) {
  const ctx = useContext(DemoAuthContext);
  const handleClick = () => {
    ctx?.setSignedIn(true);
    window.location.href = '/dashboard';
  };

  if (children) {
    // Clone the child element and attach onClick
    return (
      <span onClick={handleClick}>
        {children}
      </span>
    );
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
        if (afterSignOutUrl) window.location.href = afterSignOutUrl;
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
