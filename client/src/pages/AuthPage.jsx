import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, HeartHandshake, Truck, ShieldCheck, LogIn, ArrowRight, Sparkles } from 'lucide-react';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'restaurant';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState(`${initialRole}@foodbridge.ai`);
  const [password, setPassword] = useState('password123');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (r) => {
    setSelectedRole(r);
    setEmail(`${r}@foodbridge.ai`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
    navigate(`/${selectedRole}`);
  };

  const rolesConfig = [
    { id: 'restaurant', label: 'Restaurant / Hotel', icon: Building2, color: 'text-emerald-400', desc: 'Donate surplus food & track AI freshness' },
    { id: 'ngo', label: 'NGO / Charity', icon: HeartHandshake, color: 'text-rose-400', desc: 'Accept verified food for community distribution' },
    { id: 'volunteer', label: 'Volunteer Courier', icon: Truck, color: 'text-blue-400', desc: 'Claim delivery missions & route navigation' },
    { id: 'admin', label: 'Admin Controller', icon: ShieldCheck, color: 'text-indigo-400', desc: 'Verify restaurants, approve flagged items & analytics' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none"></div>

      <div className="max-w-xl w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4" /> AUTHENTICATION & PORTAL GATEWAY
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sign In to FoodBridge AI</h1>
          <p className="text-xs text-slate-400">Select your persona role to access your dedicated SaaS dashboard portal.</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {rolesConfig.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`p-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-slate-950 border border-emerald-500/40 shadow-lg'
                    : 'hover:bg-slate-800/50 opacity-60 hover:opacity-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${r.color}`} />
                <span className="text-[11px] font-bold text-slate-200 capitalize">{r.id}</span>
              </button>
            );
          })}
        </div>

        {/* Auth Form Card */}
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
              Selected Role:
            </div>
            <div>
              <p className="text-sm font-bold text-white capitalize">{selectedRole} Portal</p>
              <p className="text-[11px] text-slate-400">{rolesConfig.find(r => r.id === selectedRole)?.desc}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <LogIn className="w-4 h-4" /> Enter {selectedRole.toUpperCase()} Portal
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;
