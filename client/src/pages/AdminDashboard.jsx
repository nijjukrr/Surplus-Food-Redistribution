import React, { useState, useEffect } from 'react';
import { adminApi, donationsApi } from '../services/api';
import PortalLayout from '../layouts/PortalLayout';
import { getStoredDrivers } from '../services/driverService';
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
  HeartHandshake,
  Trash2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getStoredDonations = () => {
  try {
    const saved = localStorage.getItem('foodbridge_custom_donations');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const deleteStoredDonation = (id) => {
  const existing = getStoredDonations();
  const updated = existing.filter(d => String(d.id) !== String(id));
  localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
  window.dispatchEvent(new Event('storage'));
};

const getRegisteredEntities = () => {
  const currentRole = localStorage.getItem('foodbridge_role') || 'restaurant';
  const currentName = localStorage.getItem('foodbridge_user_name');
  const drivers = getStoredDrivers();

  const baseEntities = [
    { id: '1', name: currentRole === 'restaurant' && currentName ? currentName : 'Royal Spice Bistro', role: 'restaurant', email: 'restaurant@foodbridge.ai', is_verified: true },
    { id: '2', name: currentRole === 'ngo' && currentName ? currentName : 'Care & Share Foundation', role: 'ngo', email: 'ngo@foodbridge.ai', is_verified: true },
    { id: '3', name: currentRole === 'volunteer' && currentName ? currentName : 'Alex Rivera', role: 'volunteer', email: 'volunteer@foodbridge.ai', is_verified: true },
    { id: '4', name: currentRole === 'admin' && currentName ? currentName : 'System Admin', role: 'admin', email: 'admin@foodbridge.ai', is_verified: true }
  ];

  drivers.forEach(d => {
    if (!baseEntities.some(e => e.name === d.name)) {
      baseEntities.push({
        id: d.id,
        name: d.name,
        role: 'volunteer',
        email: `${d.name.toLowerCase().replace(/\s+/g, '')}@foodbridge.ai`,
        is_verified: true
      });
    }
  });

  return baseEntities;
};

export const AdminDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState(getRegisteredEntities());
  const [pendingDonations, setPendingDonations] = useState([]);
  const [allDonations, setAllDonations] = useState(getStoredDonations());
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setUsers(getRegisteredEntities());
    setAllDonations(getStoredDonations());
    Promise.all([
      adminApi.getAnalytics(), 
      adminApi.getUsers(),
      adminApi.getPendingDonations()
    ])
      .then(([analyticsRes, usersRes, pendingRes]) => {
        setAnalytics(analyticsRes.data.data);
        const apiUsers = usersRes.data.data || [];
        const localEntities = getRegisteredEntities();
        const mergedUsers = [...localEntities, ...apiUsers.filter(a => !localEntities.some(l => l.email === a.email))];
        setUsers(mergedUsers);
        setPendingDonations(pendingRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const handleStorageChange = () => {
      setAllDonations(getStoredDonations());
      setUsers(getRegisteredEntities());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location.pathname]);

  const handleDeleteOrder = (id) => {
    deleteStoredDonation(id);
    donationsApi.deleteDonation(id).catch(() => {});
    setAllDonations(getStoredDonations());
  };

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

  if (loading && !analytics && allDonations.length === 0) {
    return (
      <PortalLayout>
        <div className="text-center py-20 text-slate-500 text-xs">Loading Admin Analytics Control Center...</div>
      </PortalLayout>
    );
  }

  const overview = analytics?.overview || {};

  return (
    <PortalLayout>
      <div className="space-y-8">
        
        {/* Admin Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-950 text-xs font-extrabold shadow-md mb-2">
              <ShieldCheck className="w-4 h-4 text-slate-950" /> SYSTEM CONTROL & ANALYTICS CENTER
            </div>
            <h1 className="text-3xl font-extrabold text-white">FoodBridge Master Control</h1>
            <p className="text-xs text-slate-400 mt-1">Real-time platform throughput, AI accuracy metrics, restaurant verification, and approval queues.</p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg">
            <Sparkles className="w-4 h-4 text-slate-950" /> AI Match Efficiency: {overview.aiEfficiencyRate || '96.4%'}
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Food Saved</p>
            <p className="text-2xl font-extrabold text-white">{overview.totalFoodKg || '1250'} kg</p>
            <p className="text-[10px] text-slate-500">Rescued from landfills</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Meals Served</p>
            <p className="text-2xl font-extrabold text-white">{overview.totalMealsServed || '3750'}</p>
            <p className="text-[10px] text-slate-500">Nutritious portions</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Orders</p>
            <p className="text-2xl font-extrabold text-white">{allDonations.length}</p>
            <p className="text-[10px] text-slate-500">Items in log</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Deliveries</p>
            <p className="text-2xl font-extrabold text-white">{overview.totalDeliveries || '48'}</p>
            <p className="text-[10px] text-slate-500">Completed missions</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Avg Pickup Lag</p>
            <p className="text-2xl font-extrabold text-white">{overview.avgPickupTimeMins || '18'} mins</p>
            <p className="text-[10px] text-slate-500">Response duration</p>
          </div>
        </div>

        {/* All Food Orders Management & Deletion Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-white" /> Platform All Food Orders & Donations Queue ({allDonations.length})
            </h2>
            <span className="text-xs text-slate-400 font-semibold">Admin Delete Enabled</span>
          </div>

          {allDonations.length === 0 ? (
            <div className="text-center py-8 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No active food orders or donations currently in platform log.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allDonations.map((order) => (
                <div key={order.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-4 shadow-xl">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold border border-slate-700">
                        {order.status || 'Delivered'}
                      </span>
                      <span className="text-xs font-bold text-white">{order.quantity_kg || 20} kg</span>
                    </div>
                    <h3 className="font-extrabold text-base text-white">{order.title}</h3>
                    <p className="text-xs text-slate-400">Matched NGO: <strong className="text-slate-200">{order.matched_ngo_name || 'Care & Share Foundation'}</strong></p>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Order Settings
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Directory & Restaurant Verification */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-white" /> Platform Registered Entities & Verification
          </h2>

          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
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
                      {u.role === 'restaurant' && <Building2 className="w-4 h-4 text-white" />}
                      {u.role === 'ngo' && <HeartHandshake className="w-4 h-4 text-white" />}
                      {u.role === 'volunteer' && <Truck className="w-4 h-4 text-white" />}
                      {u.role === 'admin' && <ShieldCheck className="w-4 h-4 text-white" />}
                      {u.name}
                    </td>
                    <td className="px-6 py-4 capitalize font-semibold">{u.role}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.is_verified ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-white border border-slate-700 text-[10px] font-bold">
                          Verified Entity
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-400 font-semibold text-[10px]">Active</span>
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
