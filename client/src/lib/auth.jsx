import {
  useEffect,
  useState,
} from 'react';
import {
  SignInButton as ClerkSignInButton,
  UserButton as ClerkUserButton,
  useAuth as useClerkAuth,
  useClerk,
  useUser as useClerkUser,
} from '@clerk/clerk-react';
import { loginWithPassword, registerWithPassword, setAuthToken } from './api.js';
import { useAuth } from './authHooks.js';
import { AuthContext } from './authShared.js';

const LOCAL_AUTH_KEY = 'footprints.local-auth';

const readStoredSession = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user?.id) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const persistSession = (session) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session?.token || !session?.user?.id) {
    window.localStorage.removeItem(LOCAL_AUTH_KEY);
    return;
  }

  window.localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(session));
};

function AuthProviderBase({
  children,
  clerkEnabled,
  clerkAuth,
  clerkUser,
  clerk,
}) {
  const [localSession, setLocalSession] = useState(() => readStoredSession());
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    persistSession(localSession);
  }, [localSession]);

  useEffect(() => {
    if (localSession?.token) {
      setAuthToken(localSession.token);
      return;
    }

    setAuthToken(null);
  }, [localSession]);

  const applyLocalSession = (data) => {
    const nextSession = {
      token: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        firstName: data.user.firstName || data.user.username,
        imageUrl: data.user.imageUrl || null,
      },
    };

    setLocalSession(nextSession);
    setLocalError('');
    setAuthToken(nextSession.token);
    return nextSession;
  };

  const signInWithPassword = async ({ username, password }) => {
    setIsLocalLoading(true);
    setLocalError('');

    try {
      const response = await loginWithPassword({ username, password });
      return applyLocalSession(response.data);
    } catch (error) {
      const message = error?.response?.data?.error || 'Unable to sign in.';
      setLocalError(message);
      throw new Error(message);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const signUpWithPassword = async ({ username, password }) => {
    setIsLocalLoading(true);
    setLocalError('');

    try {
      const response = await registerWithPassword({ username, password });
      return applyLocalSession(response.data);
    } catch (error) {
      const message = error?.response?.data?.error || 'Unable to create account.';
      setLocalError(message);
      throw new Error(message);
    } finally {
      setIsLocalLoading(false);
    }
  };

  const clearLocalSession = () => {
    setLocalSession(null);
    setLocalError('');
    setAuthToken(null);
  };

  const activeMode = localSession?.token
    ? 'local'
    : clerkAuth.isSignedIn
      ? 'clerk'
      : 'signed-out';

  const authValue = {
    authMode: activeMode,
    clerkEnabled,
    isLoaded: clerkEnabled ? clerkAuth.isLoaded && clerkUser.isLoaded : true,
    isSignedIn: activeMode !== 'signed-out',
    userId: activeMode === 'local' ? localSession.user.id : clerkAuth.userId,
    getToken: async () => {
      if (activeMode === 'local') {
        return localSession?.token || null;
      }

      if (activeMode === 'clerk') {
        return clerkAuth.getToken();
      }

      return null;
    },
    user: activeMode === 'local' ? localSession.user : clerkUser.user,
    localError,
    isLocalLoading,
    signInWithPassword,
    signUpWithPassword,
    clearLocalSession,
    signOut: async (afterSignOutUrl = '/') => {
      if (activeMode === 'local') {
        clearLocalSession();
        if (typeof window !== 'undefined') {
          window.location.href = afterSignOutUrl;
        }
        return;
      }

      if (activeMode === 'clerk' && clerk) {
        await clerk.signOut({ redirectUrl: afterSignOutUrl });
      }
    },
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

function ClerkBackedAuthProvider({ children }) {
  const clerkAuth = useClerkAuth();
  const clerkUser = useClerkUser();
  const clerk = useClerk();

  return (
    <AuthProviderBase
      clerkEnabled
      clerkAuth={clerkAuth}
      clerkUser={clerkUser}
      clerk={clerk}
    >
      {children}
    </AuthProviderBase>
  );
}

export function AuthProvider({ children, clerkEnabled = false }) {
  if (clerkEnabled) {
    return <ClerkBackedAuthProvider>{children}</ClerkBackedAuthProvider>;
  }

  return (
    <AuthProviderBase
      clerkEnabled={false}
      clerkAuth={{ isLoaded: true, isSignedIn: false, userId: null, getToken: async () => null }}
      clerkUser={{ isLoaded: true, user: null }}
      clerk={null}
    >
      {children}
    </AuthProviderBase>
  );
}

export function SignedIn({ children }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? children : null;
}

export function SignedOut({ children }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? null : children;
}

export function SignInButton({ children, ...props }) {
  const { clerkEnabled } = useAuth();

  if (!clerkEnabled) {
    return children || null;
  }

  return <ClerkSignInButton {...props}>{children}</ClerkSignInButton>;
}

export function UserButton({ afterSignOutUrl = '/' }) {
  const { authMode, signOut, user } = useAuth();

  if (authMode === 'clerk') {
    return <ClerkUserButton afterSignOutUrl={afterSignOutUrl} />;
  }

  const initials = (user?.username || user?.firstName || 'F').slice(0, 1).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => void signOut(afterSignOutUrl)}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border text-sm font-bold"
      style={{
        borderColor: 'rgba(167,139,250,0.22)',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.24), rgba(109,40,217,0.12))',
        color: '#f8fafc',
        boxShadow: '0 10px 24px rgba(124,58,237,0.18)',
      }}
      title="Sign out"
    >
      {initials}
    </button>
  );
}
