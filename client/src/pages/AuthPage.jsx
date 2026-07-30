import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Building2, HeartHandshake, Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('restaurant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRole(selectedRole);

    if (selectedRole === 'restaurant') navigate('/restaurant');
    else if (selectedRole === 'ngo') navigate('/ngo');
    else if (selectedRole === 'volunteer') navigate('/volunteer');
    else navigate('/admin');
  };

  const roles = [
    { id: 'restaurant', label: 'Restaurant', icon: Building2, desc: 'Donate surplus meals' },
    { id: 'ngo', label: 'NGO / Charity', icon: HeartHandshake, desc: 'Receive food for beneficiaries' },
    { id: 'volunteer', label: 'Volunteer', icon: Truck, desc: 'Deliver food across town' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Platform monitoring' }
  ];

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back to FoodBridge' : 'Create FoodBridge Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Sign in to access your portal' : 'Join our zero-waste redistribution network'}
          </p>
        </div>

        {/* Role Picker Pills */}
        <div className="grid grid-cols-2 gap-2">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="text-xs font-bold">{r.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{r.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Org Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Royal Spice Bistro"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${selectedRole}@foodbridge.ai`}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {isLogin ? 'Sign In to Portal' : 'Register Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign in"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
