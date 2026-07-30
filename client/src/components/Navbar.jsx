import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

export const Navbar = () => {
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

      </div>
    </header>
  );
};

export default Navbar;
