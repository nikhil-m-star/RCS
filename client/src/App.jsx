import { useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './lib/authHooks.js';
import {
  SignInButton,
  SignedIn,
  SignedOut,
} from './lib/auth.jsx';
import { Dashboard } from './pages/Dashboard';
import { Leaderboard } from './pages/Leaderboard';
import { Spellbook } from './pages/Spellbook';
import { NavBar } from './components/NavBar';
import { PageShell } from './components/PageShell';
import { TetrisFall } from './components/TetrisFall';

function LandingPage() {
  const navigate = useNavigate();
  const {
    clerkEnabled,
    isSignedIn,
    isLocalLoading,
    localError,
    signInWithPassword,
    signUpWithPassword,
  } = useAuth();
  const [mode, setMode] = useState('signin');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    try {
      if (mode === 'signin') {
        await signInWithPassword(credentials);
      } else {
        await signUpWithPassword(credentials);
      }

      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Unable to continue.');
    }
  };

  const errorMessage = submitError || localError;

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageShell className="overflow-hidden">
      <div className="landing-grid">
        <NavBar />

        <div className="landing-main-content">
          <TetrisFall delay={0.06} className="flex">
            <section className="hero-card">
              <div className="hero-top-glow" />

              <div className="relative">
                <div className="hero-badge">
                  <span className="badge-dot" />
                  Hybrid Entry
                </div>

                <h1 className="hero-title">
                  Eco<span>Tetris</span>
                </h1>

                <p className="hero-description">
                  Build your eco-legacy one block at a time.
                </p>

                <div className="feature-grid">
                  {[
                    ['Grid', 'Watch your actions stack up.'],
                    ['History', 'Analyze your past spells.'],
                    ['Coven', 'Rise through the rankings.'],
                  ].map(([title, body], index) => (
                    <div
                      key={title}
                      className={`feature-card ${index === 0 ? 'active' : ''}`}
                    >
                      <div className="text-label">{title}</div>
                      <div className="mt-2 text-sm font-medium" style={{ color: '#e2e8f0' }}>
                        {body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-footer">
                <div>
                  <div className="text-label">
                    Routes
                  </div>
                  <div className="route-badge-list">
                    {['/dashboard', '/spellbook', '/coven'].map((item) => (
                      <div key={item} className="route-badge">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card px-5 py-4 hidden lg-block" style={{ borderRadius: '28px' }}>
                  <div className="text-label">
                    Auth
                  </div>
                  <div className="mt-3 text-sm leading-7" style={{ color: '#e2e8f0' }}>
                    Username + password works with JWT.
                    <br />
                    {clerkEnabled ? 'Clerk stays available too.' : 'Clerk can still be added later.'}
                  </div>
                </div>
              </div>
            </section>
          </TetrisFall>

          <TetrisFall delay={0.14} className="flex">
            <section className="auth-card">
              <div className="auth-header">
                <div>
                  <div className="text-label">Access</div>
                  <div className="text-title" style={{ fontSize: '1.875rem', marginTop: '0.5rem' }}>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                  </div>
                </div>

                <div className="mode-pills">
                  {['signin', 'signup'].map((item) => {
                    const active = item === mode;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className={`mode-btn ${active ? 'active' : ''}`}
                      >
                        {item === 'signin' ? 'In' : 'Up'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <div className="text-label" style={{ marginBottom: '0.5rem' }}>
                      Username
                    </div>
                    <input
                      type="text"
                      autoComplete="username"
                      value={credentials.username}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, username: event.target.value }))
                      }
                      className="input-field"
                      placeholder="wanderingflame"
                      required
                    />
                  </div>

                  <div>
                    <div className="text-label" style={{ marginBottom: '0.5rem' }}>
                      Password
                    </div>
                    <input
                      type="password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      className="input-field"
                      placeholder="minimum 8 characters"
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="error-banner">
                    {errorMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '1.5rem', width: '100%' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLocalLoading}
                >
                  {isLocalLoading ? 'Working' : mode === 'signin' ? 'Enter' : 'Create'}
                </motion.button>

                {clerkEnabled && (
                  <div className="clerk-divider">
                    <div className="text-label" style={{ marginBottom: '1rem' }}>
                      Or continue with Clerk
                    </div>

                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
                      <motion.button
                        type="button"
                        className="btn-secondary"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue with Clerk
                      </motion.button>
                    </SignInButton>
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', fontSize: '0.875rem', lineHeight: '1.75', color: '#94a3b8' }}>
                  {mode === 'signin'
                    ? 'Use the same credentials next time to restore your path.'
                    : 'Creating an account also creates your Neon user record on first entry.'}
                </div>
              </form>
            </section>
          </TetrisFall>
        </div>
      </div>
    </PageShell>
  );
}

function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return (
      <PageShell style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TetrisFall delay={0.05} style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto', height: '0.75rem', width: '0.75rem', borderRadius: '9999px', background: '#7c3aed', boxShadow: '0 0 24px rgba(124,58,237,0.8)' }} />
        </TetrisFall>
      </PageShell>
    );
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={(
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/spellbook"
        element={(
          <ProtectedRoute>
            <Spellbook />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/coven"
        element={(
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
