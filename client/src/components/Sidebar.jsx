import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Building2,
  HeartHandshake,
  Truck,
  ShieldCheck,
  PlusCircle,
  Clock,
  Sparkles,
  Bell,
  User,
  LogOut,
  BarChart3,
  CheckSquare,
  MapPin,
  Settings,
  FileSpreadsheet,
  Users,
  CheckCircle2
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'restaurant':
        return {
          title: 'Restaurant Portal',
          subtitle: 'Donor Controller',
          icon: Building2,
          color: 'from-emerald-500 to-teal-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          links: [
            { path: '/restaurant', label: 'Dashboard Home', icon: Building2 },
            { path: '/restaurant/donate', label: 'Donate Surplus Food', icon: PlusCircle },
            { path: '/restaurant/active', label: 'Active Donations', icon: Clock },
            { path: '/restaurant/history', label: 'Donation History', icon: CheckSquare },
            { path: '/restaurant/ai-analysis', label: 'AI Intelligence', icon: Sparkles },
            { path: '/restaurant/notifications', label: 'Notifications', icon: Bell },
            { path: '/restaurant/profile', label: 'Restaurant Profile', icon: User },
          ]
        };
      case 'ngo':
        return {
          title: 'NGO Hub Portal',
          subtitle: 'Beneficiary Controller',
          icon: HeartHandshake,
          color: 'from-rose-500 to-pink-400',
          badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          links: [
            { path: '/ngo', label: 'Dashboard Home', icon: HeartHandshake },
            { path: '/ngo/available', label: 'Available Donations', icon: Sparkles },
            { path: '/ngo/accepted', label: 'Accepted Donations', icon: CheckCircle2 },
            { path: '/ngo/history', label: 'Distribution History', icon: CheckSquare },
            { path: '/ngo/notifications', label: 'Notifications', icon: Bell },
            { path: '/ngo/profile', label: 'NGO Profile', icon: User },
          ]
        };
      case 'volunteer':
        return {
          title: 'Volunteer Portal',
          subtitle: 'Logistics Courier',
          icon: Truck,
          color: 'from-blue-500 to-indigo-400',
          badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          links: [
            { path: '/volunteer', label: 'Dashboard Home', icon: Truck },
            { path: '/volunteer/deliveries', label: 'Assigned Deliveries', icon: CheckSquare },
            { path: '/volunteer/navigation', label: 'Route Navigation', icon: MapPin },
            { path: '/volunteer/history', label: 'Delivery History', icon: Clock },
            { path: '/volunteer/notifications', label: 'Notifications', icon: Bell },
            { path: '/volunteer/profile', label: 'Volunteer Profile', icon: User },
          ]
        };
      case 'admin':
      default:
        return {
          title: 'Admin Master',
          subtitle: 'System Controller',
          icon: ShieldCheck,
          color: 'from-indigo-500 to-purple-400',
          badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          links: [
            { path: '/admin', label: 'Dashboard Overview', icon: ShieldCheck },
            { path: '/admin/pending', label: 'Pending Approvals', icon: Clock },
            { path: '/admin/restaurants', label: 'Restaurant Directory', icon: Building2 },
            { path: '/admin/ngos', label: 'NGO Directory', icon: HeartHandshake },
            { path: '/admin/volunteers', label: 'Volunteer Roster', icon: Truck },
            { path: '/admin/analytics', label: 'Advanced Analytics', icon: BarChart3 },
            { path: '/admin/reports', label: 'System Reports', icon: FileSpreadsheet },
            { path: '/admin/settings', label: 'System Settings', icon: Settings },
          ]
        };
    }
  };

  const config = getRoleConfig();
  const HeaderIcon = config.icon;

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-40 backdrop-blur-xl">
      <div>
        {/* Brand & Portal Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${config.color} flex items-center justify-center shadow-lg shadow-emerald-500/10`}>
              <HeaderIcon className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight">{config.title}</h2>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-0.5 ${config.badgeBg}`}>
                {config.subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>
          {config.links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`
                }
              >
                <LinkIcon className="w-4 h-4 shrink-0" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate capitalize">{role} Role</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
