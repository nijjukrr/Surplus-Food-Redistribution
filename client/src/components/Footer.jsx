import React from 'react';
import { UtensilsCrossed, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="FoodBridge Logo" className="h-9 w-auto object-contain rounded-lg bg-white/95 p-1 shadow-sm" />
          <div>
            <span className="font-bold text-slate-200 text-sm">FoodBridge AI Platform</span>
            <p className="text-[11px] text-slate-500">Zero Food Waste. Zero Hunger. Powered by Gemini AI & Supabase.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Gemini AI Engine
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Supabase Realtime DB
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Built for Social Good
          </span>
        </div>

        <div className="text-slate-500">
          © {new Date().getFullYear()} FoodBridge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
