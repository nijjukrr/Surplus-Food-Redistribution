import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const PortalLayout = ({ children }) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans text-slate-100 antialiased relative">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Portal Viewport */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-slate-300 hover:text-white flex items-center gap-2 font-semibold transition-colors">
              <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain rounded bg-white p-0.5" />
              <span>FoodBridge AI Visitor Home</span>
            </Link>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-extrabold text-white capitalize">{role} Controller Portal</span>
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
