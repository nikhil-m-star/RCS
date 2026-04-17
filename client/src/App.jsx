import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton, 
  useUser 
} from '@clerk/clerk-react';
import { Layout, ArrowRight } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
      <div className="hero-glow"></div>
      
      <nav className="absolute top-0 w-full flex justify-between items-center p-6 container">
        <div className="text-2xl font-bold flex items-center gap-2">
          <Layout className="text-primary" />
          <span>RCS <span className="text-primary">CORE</span></span>
        </div>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">Get Started</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-semibold hover:text-primary transition-colors">Dashboard</a>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      <main className="text-center z-10">
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          The <span className="text-primary">Elite</span> Command <br /> Control System.
        </h1>
        <p className="text-text-muted text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          High-performance, secure, and visually stunning management for your regional operations. Built for those who demand excellence.
        </p>
        
        <SignedIn>
          <a href="/dashboard">
            <button className="btn-primary px-12 py-4 text-xl flex items-center gap-2 mx-auto">
              Enter Command Center
              <ArrowRight size={20} />
            </button>
          </a>
        </SignedIn>
        
        <SignedOut>
          <div className="flex gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="btn-primary px-12 py-4 text-xl">
                Deploy System
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>

      <footer className="absolute bottom-10 text-text-muted opacity-50">
        &copy; 2024 RCS Elite Infrastructure. All Rights Reserved.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/dashboard" 
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/" />
            </SignedOut>
          </>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
