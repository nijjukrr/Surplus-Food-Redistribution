import React, { useState, useEffect } from 'react';
import { adminApi, donationsApi } from '../services/api';
import PortalLayout from '../layouts/PortalLayout';
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
  Sparkles,
  CheckCircle2,
  XCircle,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const AdminDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      adminApi.getAnalytics(), 
      adminApi.getUsers(),
      adminApi.getPendingDonations()
    ])
      .then(([analyticsRes, usersRes, pendingRes]) => {
        setAnalytics(analyticsRes.data.data);
        setUsers(usersRes.data.data || []);
        setPendingDonations(pendingRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await adminApi.approveDonation(id);
      fetchData();
    } catch (err) {
      alert('Error approving donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    setActionId(id);
    try {
      await adminApi.rejectDonation(id);
      fetchData();
    } catch (err) {
      alert('Error rejecting donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionId(null);
    }
  };

  const handleVerifyRestaurant = async (id) => {
    setActionId(id);
    try {
      await adminApi.verifyRestaurant(id);
      fetchData();
    } catch (err) {
      alert('Error verifying restaurant: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionId(null);
    }
  };

  if (loading && !analytics) {
    return (
      <PortalLayout>
        <div className="text-center py-20 text-slate-500 text-xs">Loading Admin Analytics Control Center...</div>
      </PortalLayout>
    );
  }

  const overview = analytics?.overview || {};
  const categories = analytics?.categoryDistribution || {};

  return (
    <PortalLayout>
      <div className="space-y-8">
        
        {/* Admin Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> SYSTEM CONTROL & ANALYTICS CENTER
            </div>
            <h1 className="text-3xl font-extrabold text-white">FoodBridge Master Control</h1>
            <p className="text-xs text-slate-400 mt-1">Real-time platform throughput, AI accuracy metrics, restaurant verification, and approval queues.</p>
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
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Pending Reviews</p>
            <p className="text-2xl font-extrabold text-amber-400">{pendingDonations.length}</p>
            <p className="text-[10px] text-slate-500">Items under review</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Deliveries</p>
            <p className="text-2xl font-extrabold text-indigo-400">{overview.totalDeliveries}</p>
            <p className="text-[10px] text-slate-500">Completed missions</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Avg Pickup Lag</p>
            <p className="text-2xl font-extrabold text-rose-400">{overview.avgPickupTimeMins} mins</p>
            <p className="text-[10px] text-slate-500">Response duration</p>
          </div>
        </div>

        {/* Pending Approvals Review Section */}
        {(currentTab === 'pending' || pendingDonations.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Pending Admin Approvals Queue ({pendingDonations.length})
              </h2>
            </div>

            {pendingDonations.length === 0 ? (
              <div className="text-center py-8 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No items currently pending admin approval. AI auto-approved verified donations.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingDonations.map((item) => (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                        Pending Verification
                      </span>
                      <span className="text-xs font-bold text-slate-300">{item.quantity_kg} kg</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{item.title}</h3>
                      <p className="text-xs text-slate-400">Donor: {item.restaurant_name || 'Unverified Donor'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actionId === item.id}
                        className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Reject Submission
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionId === item.id}
                        className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve & Send to NGOs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Directory & Restaurant Verification */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Platform Registered Entities & Verification
          </h2>

          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Entity Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Verification Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      {u.role === 'restaurant' && <Building2 className="w-4 h-4 text-emerald-400" />}
                      {u.role === 'ngo' && <HeartHandshake className="w-4 h-4 text-rose-400" />}
                      {u.role === 'volunteer' && <Truck className="w-4 h-4 text-blue-400" />}
                      {u.role === 'admin' && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                      {u.name}
                    </td>
                    <td className="px-6 py-4 capitalize font-semibold">{u.role}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.is_verified ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Verified Entity
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role === 'restaurant' && !u.is_verified ? (
                        <button
                          onClick={() => handleVerifyRestaurant(u.id)}
                          disabled={actionId === u.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[11px]"
                        >
                          Verify Restaurant
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
