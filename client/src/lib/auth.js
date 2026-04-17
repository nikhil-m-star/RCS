// Unified auth hook — uses Clerk when available, falls back to demo mode
const isDemoMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

let useAuthHook, useUserHook, SignedInComp, SignedOutComp, SignInButtonComp, UserButtonComp;

if (isDemoMode) {
  // Lazy-loaded at module level for demo
  const [demoHooks, demoComponents] = await Promise.all([
    import('./demoAuthHooks.js'),
    import('./DemoProvider.jsx'),
  ]);
  useAuthHook = demoHooks.useDemoAuth;
  useUserHook = demoHooks.useDemoUser;
  SignedInComp = demoComponents.DemoSignedIn;
  SignedOutComp = demoComponents.DemoSignedOut;
  SignInButtonComp = demoComponents.DemoSignInButton;
  UserButtonComp = demoComponents.DemoUserButton;
} else {
  const clerk = await import('@clerk/clerk-react');
  useAuthHook = clerk.useAuth;
  useUserHook = clerk.useUser;
  SignedInComp = clerk.SignedIn;
  SignedOutComp = clerk.SignedOut;
  SignInButtonComp = clerk.SignInButton;
  UserButtonComp = clerk.UserButton;
}

export const useAuth = useAuthHook;
export const useUser = useUserHook;
export const SignedIn = SignedInComp;
export const SignedOut = SignedOutComp;
export const SignInButton = SignInButtonComp;
export const UserButton = UserButtonComp;
