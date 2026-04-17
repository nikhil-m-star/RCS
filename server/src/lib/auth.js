import { requireAuth as clerkRequireAuth } from '@clerk/express';

export const requireAuth = () => {
  if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    return clerkRequireAuth();
  }
  
  // Demo mode bypass
  return (req, res, next) => {
    // If we're in demo mode, authenticate as the demo user automatically
    req.auth = { userId: 'demo_user_001' };
    next();
  };
};
