import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { 
  ShieldCheck, 
  Utensils, 
  Heart, 
  Truck, 
  TrendingUp, 
  Clock, 
  Award, 
  PieChart, 
  Users, 
  FileText,
  Sparkles
} from 'lucide-react';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getAnalytics(), adminApi.getUsers()])
      .then(([analyticsRes, usersRes]) => {
        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-500 text-xs">Loading Admin Analytics Control Center...</div>;
  }

  const overview = analytics?.overview || {};
  const categories = analytics?.categoryDistribution || {};
  const top = analytics?.topContributors || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> SYSTEM CONTROL & ANALYTICS CENTER
          </div>
          <h1 className="text-3xl font-extrabold text-white">FoodBridge Master Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time platform throughput, AI accuracy metrics, and user management.</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> AI Match Efficiency: {overview.aiEfficiencyRate || '96.4%'}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Food Saved</p>
          <p className="text-2xl font-extrabold text-emerald-400">{overview.totalFoodKg} kg</p>
          <p className="text-[10px] text-slate-500">Rescued from landfills</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase">Meals Served</p>
          <p className="text-2xl font-extrabold text-teal-300">{overview.totalMealsServed}</p>
          <p className="text-[10px] text-slate-500">Nutritious portions</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Deliveries</p>
          <p className="text-2xl font-extrabold text-amber-400">{overview.totalDeliveries}</p>
          <p className="text-[10px] text-slate-500">Completed missions</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase">Avg Pickup Lag</p>
          <p className="text-2xl font-extrabold text-indigo-400">{overview.avgPickupTimeMins} mins</p>
          <p className="text-[10px] text-slate-500">Response time</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase">Avg Delivery Lag</p>
          <p className="text-2xl font-extrabold text-rose-400">{overview.avgDeliveryTimeMins} mins</p>
          <p className="text-[10px] text-slate-500">Transit duration</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Contributors Leaderboard */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Platform Leaderboard
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Top Restaurant</span>
              <p className="font-bold text-slate-200 mt-0.5">{top.restaurant}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Top NGO Receiver</span>
              <p className="font-bold text-slate-200 mt-0.5">{top.ngo}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Top Volunteer Courier</span>
              <p className="font-bold text-slate-200 mt-0.5">{top.volunteer}</p>
            </div>
          </div>
        </div>

        {/* Food Category Distribution Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" /> Category Distribution
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { label: 'Cooked Meals', val: categories.cooked_meal || 55, color: 'bg-emerald-500' },
              { label: 'Bakery & Pastries', val: categories.bakery || 20, color: 'bg-amber-500' },
              { label: 'Raw Produce & Fruits', val: categories.raw_produce || 15, color: 'bg-indigo-500' },
              { label: 'Packaged Foods', val: categories.packaged_food || 10, color: 'bg-rose-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{cat.label}</span>
                  <span className="font-bold">{cat.val}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Stream */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" /> Realtime Audit Stream
          </h3>

          <div className="space-y-3 text-xs">
            {(analytics?.recentActivity || []).map((act) => (
              <div key={act.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-bold text-emerald-400">{act.action}</span>
                  <span className="text-[10px] text-slate-500">{act.time}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{act.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* User Management Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Registered System Entities
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Entity Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-100">{u.name}</td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3 capitalize font-bold text-emerald-400">{u.role}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
