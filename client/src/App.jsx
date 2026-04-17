import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from './lib/auth.js';
import { motion } from 'framer-motion';
import { Dashboard } from './pages/Dashboard';
import { Spellbook } from './pages/Spellbook';
import { Leaderboard } from './pages/Leaderboard';

function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0a0a0f' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}
      />

      {/* Fog layers */}
      <div className="fog-layer fog-layer-1" />
      <div className="fog-layer fog-layer-2" />

      <motion.div
        className="text-center z-10"
        initial={{ y: '-120vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 60 }}
      >
        {/* Cauldron icon */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-6">
          <path
            d="M15,30 Q12,65 40,68 Q68,65 65,30"
            fill="#12121a" stroke="#7c3aed" strokeWidth="2.5"
          />
          <ellipse cx="40" cy="29" rx="27" ry="8" fill="#12121a" stroke="#7c3aed" strokeWidth="2.5" />
          <motion.path
            d="M28,48 Q33,42 38,48 Q43,54 48,48"
            fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.path
            d="M35,22 Q33,14 37,10"
            fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round"
            animate={{ opacity: [0.3, 0.08, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          />
          <motion.path
            d="M45,20 Q47,12 43,8"
            fill="none" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round"
            animate={{ opacity: [0.2, 0.05, 0.2], y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.8 }}
          />
        </svg>

        <h1 className="text-5xl font-bold mb-4" style={{ color: '#e2e8f0' }}>
          Foot<span style={{ color: '#a78bfa' }}>prints</span>
        </h1>

        <p className="text-base mb-10 max-w-xs mx-auto" style={{ color: '#64748b' }}>
          Brew your path. Track your trace.
        </p>

        <SignedOut>
          <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
            <motion.button
              id="landing-enter-btn"
              className="px-10 py-3 rounded-full text-lg font-bold border-2 cursor-pointer"
              style={{
                background: '#7c3aed',
                borderColor: '#a78bfa',
                color: '#e2e8f0',
                boxShadow: '0 0 30px rgba(124,58,237,0.4)',
              }}
              whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(124,58,237,0.6)' }}
              whileTap={{ scale: 0.94 }}
            >
              Enter
            </motion.button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <motion.a
            href="/dashboard"
            className="inline-block px-10 py-3 rounded-full text-lg font-bold border-2 no-underline"
            style={{
              background: '#7c3aed',
              borderColor: '#a78bfa',
              color: '#e2e8f0',
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            }}
            whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(124,58,237,0.6)' }}
            whileTap={{ scale: 0.94 }}
          >
            Enter
          </motion.a>
        </SignedIn>
      </motion.div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/" /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/spellbook" element={<ProtectedRoute><Spellbook /></ProtectedRoute>} />
      <Route path="/coven" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
