import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Bell, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const PortalLayout = ({ children }) => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Portal Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 font-medium transition-colors">
              <UtensilsCrossed className="w-3.5 h-3.5" /> FoodBridge AI Visitor Home
            </Link>
            <span className="text-slate-700">•</span>
            <span className="text-xs font-bold text-slate-300 capitalize">{role} Controller Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Engine Online
            </span>
          </div>
        </header>

        {/* Content Children */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
