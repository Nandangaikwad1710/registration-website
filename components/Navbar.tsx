
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            H
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
            HackPulse
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-indigo-400 transition-colors">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-indigo-400 transition-colors">Dashboard</Link>
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-white">{user.name}</span>
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest mono">{user.role}</span>
                </div>
                <button 
                  onClick={() => { onLogout(); navigate('/'); }}
                  className="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-600/20"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
