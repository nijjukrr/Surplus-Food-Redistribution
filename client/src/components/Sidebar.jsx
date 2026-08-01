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
  LogOut,
  BarChart3,
  CheckSquare,
  MapPin,
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
          color: 'from-white to-slate-300',
          badgeBg: 'bg-white/10 text-white border-white/20',
          links: [
            { path: '/restaurant', label: 'Dashboard Home', icon: Building2 },
            { path: '/restaurant/donate', label: 'Donate Surplus Food', icon: PlusCircle },
            { path: '/restaurant/active', label: 'Active Donations', icon: Clock },
            { path: '/restaurant/history', label: 'Donation History', icon: CheckSquare },
          ]
        };
      case 'ngo':
        return {
          title: 'NGO Hub Portal',
          subtitle: 'Beneficiary Controller',
          icon: HeartHandshake,
          color: 'from-white to-slate-300',
          badgeBg: 'bg-white/10 text-white border-white/20',
          links: [
            { path: '/ngo', label: 'Dashboard Home', icon: HeartHandshake },
            { path: '/ngo/available', label: 'Available Donations', icon: Clock },
            { path: '/ngo/accepted', label: 'Accepted Donations', icon: CheckCircle2 },
            { path: '/ngo/history', label: 'Distribution History', icon: CheckSquare },
          ]
        };
      case 'volunteer':
        return {
          title: 'NGO Delivery Partner',
          subtitle: 'Volunteer Courier Driver',
          icon: Truck,
          color: 'from-white to-slate-300',
          badgeBg: 'bg-white/10 text-white border-white/20',
          links: [
            { path: '/volunteer', label: 'Dashboard Home', icon: Truck },
            { path: '/volunteer/deliveries', label: 'Assigned Deliveries', icon: CheckSquare },
            { path: '/volunteer/navigation', label: 'Route Navigation', icon: MapPin },
            { path: '/volunteer/history', label: 'Delivery History', icon: Clock },
          ]
        };
      case 'admin':
      default:
        return {
          title: 'Admin Master',
          subtitle: 'System Controller',
          icon: ShieldCheck,
          color: 'from-white to-slate-300',
          badgeBg: 'bg-white/10 text-white border-white/20',
          links: [
            { path: '/admin', label: 'Dashboard Overview', icon: ShieldCheck },
            { path: '/admin/pending', label: 'Pending Approvals', icon: Clock },
            { path: '/admin/restaurants', label: 'Restaurant Directory', icon: Building2 },
            { path: '/admin/ngos', label: 'NGO Directory', icon: HeartHandshake },
            { path: '/admin/volunteers', label: 'Volunteer Roster', icon: Truck },
            { path: '/admin/analytics', label: 'Advanced Analytics', icon: BarChart3 },
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
            <img
              src="/logo.png"
              alt="FoodBridge Logo"
              className="w-10 h-10 object-contain rounded-xl bg-white/95 p-1 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <h2 className="font-extrabold text-sm text-white tracking-tight truncate">{config.title}</h2>
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
