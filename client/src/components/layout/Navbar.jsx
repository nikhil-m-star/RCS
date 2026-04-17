import { UserButton } from '@clerk/clerk-react';
import { Layout, Shield, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl glass rounded-full px-6 py-3 flex justify-between items-center z-50">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl">
        <Layout className="text-primary" size={24} />
        <span>RCS <span className="text-primary">CORE</span></span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
        <Link to="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
          <BarChart3 size={16} />
          Dashboard
        </Link>
        <Link to="/security" className="hover:text-primary transition-colors flex items-center gap-2">
          <Shield size={16} />
          Security
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
