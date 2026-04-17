import { requireAuth as clerkRequireAuth } from '@clerk/express';
import { verifyJwt } from './jwt.js';

function getBearerToken(req) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length);
}

export const requireAuth = () => {
  const clerkAuth = process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
    ? clerkRequireAuth()
    : null;

  if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    return (req, res, next) => {
      const token = getBearerToken(req);

      if (token) {
        try {
          const payload = verifyJwt(token);
          req.auth = { userId: payload.sub, authType: 'jwt' };
          return next();
        } catch {
          return res.status(401).json({ error: 'Invalid token.' });
        }
      }

      return clerkAuth(req, res, next);
    };
  }

  // Demo mode bypass
  return (req, res, next) => {
    const token = getBearerToken(req);

    if (token) {
      try {
        const payload = verifyJwt(token);
        req.auth = { userId: payload.sub, authType: 'jwt' };
        return next();
      } catch {
        return res.status(401).json({ error: 'Invalid token.' });
      }
    }

    // If we're in demo mode, authenticate as the demo user automatically
    req.auth = { userId: 'demo_user_001' };
    next();
  };
};
