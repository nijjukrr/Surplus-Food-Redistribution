import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, LogIn, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, role, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FoodBridge <span className="text-emerald-400">AI</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">SURPLUS REDISTRIBUTION</p>
          </div>
        </Link>

        {/* Visitor Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
          <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">AI Engine</a>
          <a href="#stats" className="hover:text-emerald-400 transition-colors">Impact Stats</a>
          <a href="#sdg" className="hover:text-emerald-400 transition-colors">SDG #2 Goal</a>
          <a href="#portals" className="hover:text-emerald-400 transition-colors">Choose Portal</a>
        </nav>

        {/* Right CTA / Portal Access */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={`/${role}`}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Go to {role.toUpperCase()} Portal
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4 text-emerald-400" /> Sign In / Portal Entry
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
