import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationsApi } from '../services/api';
import { 
  UtensilsCrossed, 
  Building2, 
  HeartHandshake, 
  Truck, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, setRole } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationsApi.getNotifications()
      .then(res => setNotifications(res.data.data || []))
      .catch(() => {});
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: UtensilsCrossed },
    { path: '/restaurant', label: 'Restaurant Portal', icon: Building2, activeRole: 'restaurant' },
    { path: '/ngo', label: 'NGO Portal', icon: HeartHandshake, activeRole: 'ngo' },
    { path: '/volunteer', label: 'Volunteer Portal', icon: Truck, activeRole: 'volunteer' },
    { path: '/admin', label: 'Admin Analytics', icon: ShieldCheck, activeRole: 'admin' },
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (link.activeRole) {
                    setRole(link.activeRole);
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Notifications & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Notifications
                  </h4>
                  <span className="text-xs text-slate-500">Realtime</span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {item.title}
                      </div>
                      <p className="text-slate-300 mt-1">{item.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">Just now</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-xs text-slate-200 font-medium hover:border-emerald-500/50 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="capitalize text-emerald-400 font-bold">{role} Role</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Switch Active Persona
                </div>
                {[
                  { role: 'restaurant', label: 'Restaurant / Hotel', icon: Building2 },
                  { role: 'ngo', label: 'NGO / Charity', icon: HeartHandshake },
                  { role: 'volunteer', label: 'Volunteer Courier', icon: Truck },
                  { role: 'admin', label: 'Admin Controller', icon: ShieldCheck },
                ].map((item) => {
                  const RoleIcon = item.icon;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        setRole(item.role);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                        role === item.role
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <RoleIcon className="w-4 h-4 text-emerald-400" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
