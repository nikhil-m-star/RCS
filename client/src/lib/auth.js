// Unified auth hook — uses Clerk when available, falls back to demo mode
const isDemoMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

let useAuthHook, useUserHook, SignedInComp, SignedOutComp, SignInButtonComp, UserButtonComp;

if (isDemoMode) {
  // Lazy-loaded at module level for demo
  const demo = await import('./DemoProvider.jsx');
  useAuthHook = demo.useDemoAuth;
  useUserHook = demo.useDemoUser;
  SignedInComp = demo.DemoSignedIn;
  SignedOutComp = demo.DemoSignedOut;
  SignInButtonComp = demo.DemoSignInButton;
  UserButtonComp = demo.DemoUserButton;
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
