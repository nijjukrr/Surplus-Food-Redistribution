import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, HeartHandshake, Truck, ShieldCheck, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { PortalCursorBackground } from '../components/cursors/PortalCursorBackground';
import { getStoredDrivers, registerNewDriver } from '../services/driverService';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'restaurant';

  const getDefaultNameForRole = (r) => {
    if (r === 'ngo') return 'Care & Share Foundation';
    if (r === 'volunteer') return 'VIJAY';
    if (r === 'admin') return 'System Administrator';
    return 'Royal Spice Bistro';
  };

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [userName, setUserName] = useState(() => getDefaultNameForRole(initialRole));
  const [email, setEmail] = useState(`${initialRole}@foodbridge.ai`);
  const [password, setPassword] = useState('password123');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (r) => {
    setSelectedRole(r);
    setEmail(`${r}@foodbridge.ai`);
    setUserName(getDefaultNameForRole(r));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole, userName);
    navigate(`/${selectedRole}`);
  };

  const rolesConfig = [
    { 
      id: 'restaurant', 
      label: 'Restaurant', 
      icon: Building2, 
      desc: 'Donate surplus food & track AI freshness',
      theme: {
        border: 'border-emerald-500/50',
        activeBorder: 'border-emerald-400',
        text: 'text-emerald-400',
        glow: 'shadow-[0_0_25px_rgba(52,211,153,0.6)]',
        formGlow: 'shadow-[0_0_40px_rgba(52,211,153,0.25)]',
        pulse: 'via-emerald-400 shadow-[0_0_15px_#34d399]',
        btn: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.7)] hover:shadow-[0_0_50px_#34d399] border border-emerald-300/50',
        badgeBg: 'bg-emerald-950/80 border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]',
        focusBorder: 'focus:border-emerald-400 focus:ring-emerald-400 focus:shadow-[0_0_15px_rgba(52,211,153,0.4)]'
      }
    },
    { 
      id: 'ngo', 
      label: 'NGO', 
      icon: HeartHandshake, 
      desc: 'Accept verified food for community distribution',
      theme: {
        border: 'border-rose-500/50',
        activeBorder: 'border-rose-400',
        text: 'text-rose-400',
        glow: 'shadow-[0_0_25px_rgba(251,113,133,0.6)]',
        formGlow: 'shadow-[0_0_40px_rgba(251,113,133,0.25)]',
        pulse: 'via-rose-400 shadow-[0_0_15px_#fb7185]',
        btn: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-400 hover:to-pink-400 text-slate-950 shadow-[0_0_30px_rgba(251,113,133,0.7)] hover:shadow-[0_0_50px_#fb7185] border border-rose-300/50',
        badgeBg: 'bg-rose-950/80 border-rose-400/50 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.4)]',
        focusBorder: 'focus:border-rose-400 focus:ring-rose-400 focus:shadow-[0_0_15px_rgba(251,113,133,0.4)]'
      }
    },
    { 
      id: 'volunteer', 
      label: 'Volunteer', 
      icon: Truck, 
      desc: 'Claim delivery missions & route navigation',
      theme: {
        border: 'border-cyan-500/50',
        activeBorder: 'border-cyan-400',
        text: 'text-cyan-300',
        glow: 'shadow-[0_0_25px_rgba(6,182,212,0.6)]',
        formGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.25)]',
        pulse: 'via-cyan-400 shadow-[0_0_15px_#22d3ee]',
        btn: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:shadow-[0_0_50px_#22d3ee] border border-cyan-300/50',
        badgeBg: 'bg-cyan-950/80 border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
        focusBorder: 'focus:border-cyan-400 focus:ring-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
      }
    },
    { 
      id: 'admin', 
      label: 'Admin', 
      icon: ShieldCheck, 
      desc: 'Verify restaurants, approve flagged items & analytics',
      theme: {
        border: 'border-purple-500/50',
        activeBorder: 'border-purple-400',
        text: 'text-purple-400',
        glow: 'shadow-[0_0_25px_rgba(192,132,252,0.6)]',
        formGlow: 'shadow-[0_0_40px_rgba(192,132,252,0.25)]',
        pulse: 'via-purple-400 shadow-[0_0_15px_#c084fc]',
        btn: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 hover:from-purple-400 hover:to-indigo-400 text-slate-950 shadow-[0_0_30px_rgba(192,132,252,0.7)] hover:shadow-[0_0_50px_#c084fc] border border-purple-300/50',
        badgeBg: 'bg-purple-950/80 border-purple-400/50 text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.4)]',
        focusBorder: 'focus:border-purple-400 focus:ring-purple-400 focus:shadow-[0_0_15px_rgba(192,132,252,0.4)]'
      }
    },
  ];

  const currentTheme = rolesConfig.find(r => r.id === selectedRole)?.theme || rolesConfig[0].theme;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 py-12 relative overflow-hidden text-white">
      {/* 4 Interactive Portal Cursor Backgrounds in Black and White */}
      <PortalCursorBackground role={selectedRole} />

      <div className="max-w-xl w-full space-y-8 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="FoodBridge Logo" className={`h-14 mx-auto object-contain mb-3 rounded-xl bg-slate-900/90 p-2 border ${currentTheme.border} ${currentTheme.glow}`} />
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border ${currentTheme.border} ${currentTheme.text} text-xs font-black backdrop-blur-md mb-2 shadow-lg`}>
            <Sparkles className={`w-4 h-4 ${currentTheme.text}`} /> AUTHENTICATION & PORTAL GATEWAY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Sign In to FoodBridge AI</h1>
          <p className="text-xs text-slate-300 font-medium">Select your persona role to launch your dynamic cursor background and dashboard.</p>
        </div>

        {/* 3D Electric Role Selector Tabs with Respective Portal Theme Colors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          {rolesConfig.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            const t = r.theme;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRoleChange(r.id)}
                className={`relative p-3.5 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 transform-gpu overflow-hidden ${
                  isSelected
                    ? `bg-slate-900/90 border-2 ${t.activeBorder} ${t.text} font-black scale-[1.05] ${t.glow} backdrop-blur-xl`
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {isSelected && (
                  <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent ${t.pulse} to-transparent animate-pulse`}></div>
                )}
                <Icon className={`w-5 h-5 ${isSelected ? `${t.text} drop-shadow-[0_0_8px_currentColor]` : 'text-slate-400'}`} />
                <span className="text-xs font-black capitalize">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Electric Auth Form Card with Dynamic Theme Colors */}
        <div className={`relative bg-slate-950/85 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border ${currentTheme.border} space-y-6 ${currentTheme.formGlow} overflow-hidden transition-all duration-300`}>
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent ${currentTheme.pulse} to-transparent animate-pulse`}></div>

          <div className={`p-4 rounded-2xl bg-slate-900/60 border ${currentTheme.border} flex items-center gap-3 backdrop-blur-md`}>
            <div className={`p-2.5 rounded-xl ${currentTheme.badgeBg} font-black text-xs`}>
              Selected Role:
            </div>
            <div>
              <p className="text-sm font-black text-white capitalize">{selectedRole} Portal</p>
              <p className="text-[11px] text-slate-300 font-medium">{rolesConfig.find(r => r.id === selectedRole)?.desc}</p>
            </div>
          </div>

          {/* VOLUNTEER DRIVER SELECTION & REGISTRATION PANEL */}
          {selectedRole === 'volunteer' ? (
            <div className="space-y-6">
              {/* Existing Active Drivers Roster (VIJAY, AJITH, KUMAR) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-cyan-400" /> Select Registered Driver Persona
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold">{getStoredDrivers().length} Drivers Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {getStoredDrivers().map((drv) => (
                    <button
                      key={drv.id}
                      type="button"
                      onClick={() => {
                        login(`${drv.name.toLowerCase().replace(/\s+/g, '')}@foodbridge.ai`, 'password123', 'volunteer', drv.name);
                        localStorage.setItem('foodbridge_driver_id', drv.id);
                        navigate('/volunteer');
                      }}
                      className={`p-3 rounded-2xl bg-slate-900/90 border ${
                        userName === drv.name ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/40' : 'border-slate-800 hover:border-cyan-500/50'
                      } flex flex-col items-center gap-2 text-center transition-all hover:scale-[1.03] group`}
                    >
                      <img
                        src={drv.photo_url}
                        alt={drv.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-400/50 shadow-md group-hover:border-cyan-300"
                      />
                      <div>
                        <p className="font-black text-xs text-white group-hover:text-cyan-300">{drv.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{drv.bike || 'TN-37-EA-1234'}</p>
                      </div>
                      <span className="w-full py-1.5 px-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                        Login as {drv.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Join as New Driver Section */}
              <div className="pt-4 border-t border-slate-800/80 space-y-4">
                <p className="text-xs font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> New Driver? Join & Register Profile
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newName = e.target.new_driver_name.value;
                    const newBike = e.target.new_driver_bike.value;
                    const newAadhar = e.target.new_driver_aadhar.value;
                    const newPhone = e.target.new_driver_phone.value;

                    if (!newName) return;

                    const registered = registerNewDriver({
                      name: newName,
                      bike: newBike || 'TN-37-NEW-99',
                      aadhar: newAadhar || '1234-5678-9999',
                      phone: newPhone || '+91 98765 43210',
                      photo_url: '/drivers/driver1.png'
                    });

                    login(`${newName.toLowerCase().replace(/\s+/g, '')}@foodbridge.ai`, 'password123', 'volunteer', newName);
                    localStorage.setItem('foodbridge_driver_id', registered.id);
                    navigate('/volunteer');
                  }}
                  className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Driver Full Name</label>
                      <input
                        name="new_driver_name"
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Phone Number</label>
                      <input
                        name="new_driver_phone"
                        type="text"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Vehicle / Bike Number</label>
                      <input
                        name="new_driver_bike"
                        type="text"
                        required
                        placeholder="TN-37-AB-1234"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">Aadhar / Govt ID</label>
                      <input
                        name="new_driver_aadhar"
                        type="text"
                        required
                        placeholder="1234-5678-9012"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg hover:scale-[1.01] transition-transform"
                  >
                    Register & Enter Portal as New Driver
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Standard Auth Form for Restaurant, NGO, Admin */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-white mb-1.5">
                    {selectedRole === 'restaurant' ? 'Restaurant / Hotel Name' :
                     selectedRole === 'ngo' ? 'NGO / Organization Name' :
                     'Admin Display Name'}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Enter your name to appear across portal..."
                    className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs font-semibold focus:outline-none ${currentTheme.focusBorder} transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1.5">User Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs font-semibold focus:outline-none ${currentTheme.focusBorder} transition-all`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-white mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs font-semibold focus:outline-none ${currentTheme.focusBorder} transition-all`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-2xl ${currentTheme.btn} font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]`}
              >
                <LogIn className="w-4 h-4" /> Enter {selectedRole.toUpperCase()} Portal <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
