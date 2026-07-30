import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ChevronDown, Building2, HeartHandshake, Truck, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const portalOptions = [
    { role: 'restaurant', label: 'Restaurant / Hotel', icon: Building2, color: 'text-emerald-400' },
    { role: 'ngo', label: 'NGO / Charity', icon: HeartHandshake, color: 'text-rose-400' },
    { role: 'volunteer', label: 'Volunteer Courier', icon: Truck, color: 'text-blue-400' },
    { role: 'admin', label: 'Admin Controller', icon: ShieldCheck, color: 'text-indigo-400' },
  ];

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

        {/* Navigation Links: About Us & How It Works */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-400">
          <a href="#about" className="hover:text-emerald-400 transition-colors">
            About Us
          </a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
            How It Works
          </a>
        </nav>

        {/* Right Action: Select Portal Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <span>Select Portal</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-800/80 mb-1">
                Choose Persona Portal
              </div>
              {portalOptions.map((item) => {
                const RoleIcon = item.icon;
                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(`/login?role=${item.role}`);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <RoleIcon className={`w-4 h-4 ${item.color}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
