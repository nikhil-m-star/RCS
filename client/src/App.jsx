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
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-16 top-16 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22), transparent 72%)' }}
        />
        <div
          className="absolute right-0 top-1/3 h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.16), transparent 68%)' }}
        />
        <div className="fog-layer fog-layer-1" />
        <div className="fog-layer fog-layer-2" />
      </div>

      <div className="relative z-10 grid min-h-[calc(100vh-5rem)] items-stretch gap-8 lg:grid-cols-[220px_minmax(0,1.1fr)] lg:gap-10">
        <NavBar />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_420px] xl:grid-cols-[minmax(0,1.18fr)_460px]">
          <TetrisFall delay={0.06} className="flex">
            <section
              className="relative flex min-h-[38rem] flex-1 flex-col justify-between overflow-hidden rounded-[40px] border p-8 lg:p-10"
              style={{
                borderColor: 'rgba(167,139,250,0.16)',
                background:
                  'radial-gradient(circle at top, rgba(124,58,237,0.14), transparent 34%), linear-gradient(180deg, rgba(18,18,27,0.96), rgba(10,10,16,0.98))',
                boxShadow: '0 34px 80px rgba(0,0,0,0.38)',
              }}
            >
              <div className="absolute inset-x-10 top-0 h-28 bg-gradient-to-b from-[#7c3aed12] to-transparent" />

              <div className="relative">
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em]"
                  style={{
                    color: '#c4b5fd',
                    borderColor: 'rgba(167,139,250,0.18)',
                    background: 'rgba(12,12,18,0.44)',
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: '#a78bfa', boxShadow: '0 0 16px rgba(167,139,250,0.95)' }}
                  />
                  Hybrid Entry
                </div>

                <h1
                  className="mt-8 max-w-3xl text-5xl font-bold tracking-[-0.08em] sm:text-6xl xl:text-7xl"
                  style={{ color: '#f8fafc' }}
                >
                  Foot<span style={{ color: '#a78bfa' }}>prints</span>
                </h1>

                <p
                  className="mt-5 max-w-2xl text-base leading-8 lg:text-lg"
                  style={{ color: '#cbd5e1' }}
                >
                  A desktop-first ritual board for logging sustainable habits, watching today&apos;s score rise,
                  and climbing the coven ranking without losing the magical feel.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {[
                    ['Today', "Live cauldron fill tied to today's score"],
                    ['History', 'Spellbook timeline with category echoes'],
                    ['Coven', 'Leaderboard sorted by total path score'],
                  ].map(([title, body], index) => (
                    <div
                      key={title}
                      className="rounded-[28px] border p-5"
                      style={{
                        borderColor: 'rgba(255,255,255,0.05)',
                        background: index === 0 ? 'rgba(124,58,237,0.09)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div
                        className="text-[11px] uppercase tracking-[0.34em]"
                        style={{ color: '#64748b' }}
                      >
                        {title}
                      </div>
                      <div className="mt-4 text-sm leading-7" style={{ color: '#e2e8f0' }}>
                        {body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-10 flex items-end justify-between gap-6">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                    Routes
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {['/dashboard', '/spellbook', '/coven'].map((item) => (
                      <div
                        key={item}
                        className="rounded-full border px-4 py-2 text-sm"
                        style={{
                          borderColor: 'rgba(167,139,250,0.16)',
                          background: 'rgba(255,255,255,0.02)',
                          color: '#cbd5e1',
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="hidden rounded-[28px] border px-5 py-4 lg:block"
                  style={{
                    borderColor: 'rgba(167,139,250,0.16)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                    Auth
                  </div>
                  <div className="mt-3 text-sm leading-7" style={{ color: '#e2e8f0' }}>
                    Username + password now works with JWT.
                    <br />
                    {clerkEnabled ? 'Clerk stays available too.' : 'Clerk can still be added later.'}
                  </div>
                </div>
              </div>
            </section>
          </TetrisFall>

          <TetrisFall delay={0.14} className="flex">
            <section
              className="flex flex-1 flex-col rounded-[36px] border p-7 lg:p-8"
              style={{
                borderColor: 'rgba(167,139,250,0.18)',
                background: 'linear-gradient(180deg, rgba(19,19,29,0.96), rgba(10,10,16,0.98))',
                boxShadow: '0 28px 70px rgba(0,0,0,0.34)',
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                    Access
                  </div>
                  <div className="mt-2 text-3xl font-bold tracking-[-0.05em]" style={{ color: '#f8fafc' }}>
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                  </div>
                </div>

                <div
                  className="rounded-full border p-1"
                  style={{
                    borderColor: 'rgba(167,139,250,0.16)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  {['signin', 'signup'].map((item) => {
                    const active = item === mode;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setMode(item)}
                        className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em]"
                        style={{
                          color: active ? '#f8fafc' : '#94a3b8',
                          background: active
                            ? 'linear-gradient(180deg, rgba(124,58,237,0.34), rgba(109,40,217,0.24))'
                            : 'transparent',
                        }}
                      >
                        {item === 'signin' ? 'In' : 'Up'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form className="mt-8 flex flex-1 flex-col" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                      Username
                    </div>
                    <input
                      type="text"
                      autoComplete="username"
                      value={credentials.username}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, username: event.target.value }))
                      }
                      className="w-full rounded-[24px] border px-5 py-4 text-base outline-none"
                      style={{
                        borderColor: 'rgba(167,139,250,0.16)',
                        background: 'rgba(255,255,255,0.02)',
                        color: '#f8fafc',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                      }}
                      placeholder="wanderingflame"
                      required
                    />
                  </div>

                  <div>
                    <div className="mb-2 text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                      Password
                    </div>
                    <input
                      type="password"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      value={credentials.password}
                      onChange={(event) =>
                        setCredentials((current) => ({ ...current, password: event.target.value }))
                      }
                      className="w-full rounded-[24px] border px-5 py-4 text-base outline-none"
                      style={{
                        borderColor: 'rgba(167,139,250,0.16)',
                        background: 'rgba(255,255,255,0.02)',
                        color: '#f8fafc',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                      }}
                      placeholder="minimum 8 characters"
                      required
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div
                    className="mt-4 rounded-[24px] border px-4 py-3 text-sm leading-6"
                    style={{
                      borderColor: 'rgba(248,113,113,0.16)',
                      background: 'rgba(48,18,24,0.34)',
                      color: '#fda4af',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="mt-6 cursor-pointer rounded-[24px] border px-6 py-4 text-sm font-bold uppercase tracking-[0.34em]"
                  style={{
                    borderColor: '#c4b5fd',
                    background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
                    color: '#f8fafc',
                    boxShadow: '0 24px 50px rgba(124,58,237,0.28)',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLocalLoading}
                >
                  {isLocalLoading ? 'Working' : mode === 'signin' ? 'Enter with password' : 'Create with password'}
                </motion.button>

                {clerkEnabled && (
                  <div className="mt-5 border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="mb-4 text-[11px] uppercase tracking-[0.34em]" style={{ color: '#64748b' }}>
                      Or continue with Clerk
                    </div>

                    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
                      <motion.button
                        type="button"
                        className="w-full cursor-pointer rounded-[24px] border px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em]"
                        style={{
                          borderColor: 'rgba(167,139,250,0.16)',
                          background: 'rgba(255,255,255,0.03)',
                          color: '#e2e8f0',
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue with Clerk
                      </motion.button>
                    </SignInButton>
                  </div>
                )}

                <div className="mt-auto pt-6 text-sm leading-7" style={{ color: '#94a3b8' }}>
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
      <PageShell className="flex items-center justify-center">
        <TetrisFall delay={0.05} className="text-center">
          <div className="mx-auto h-3 w-3 rounded-full bg-[#7c3aed] shadow-[0_0_24px_rgba(124,58,237,0.8)]" />
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
