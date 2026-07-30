import React, { useState, useEffect } from 'react';
import { volunteerApi, donationsApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import InteractiveMap from '../components/InteractiveMap';
import PortalLayout from '../layouts/PortalLayout';
import { Truck, CheckCircle2, Navigation, User, Phone, Bike, Edit3, Save, PackageCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getStoredDonations = () => {
  try {
    const saved = localStorage.getItem('foodbridge_custom_donations');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const updateStoredStatus = (id, newStatus) => {
  const existing = getStoredDonations();
  const updated = existing.map(d => d.id === id ? { ...d, status: newStatus } : d);
  localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
};

export const VolunteerDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState(getStoredDonations());
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Volunteer Details state with localStorage persistence
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('volunteer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Alex Rivera',
      phone: '+91 98765 43210',
      vehicle_number: 'KA-01-EA-1234',
      vehicle_type: 'Two-Wheeler (Motorbike)'
    };
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('volunteer_profile', JSON.stringify(profile));
    setIsEditingProfile(false);
  };

  const fetchMissions = () => {
    setLoading(true);
    const savedCustom = getStoredDonations();
    donationsApi.getAll()
      .then((res) => {
        const apiList = res.data.data || [];
        const merged = [...savedCustom, ...apiList.filter(a => !savedCustom.some(c => c.id === a.id))];
        setDonations(merged);
      })
      .catch(() => {
        if (savedCustom.length > 0) setDonations(savedCustom);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMissions();
  }, [location.pathname]);

  const handleClaim = async (id) => {
    setProcessingId(id);
    updateStoredStatus(id, 'Volunteer Assigned');
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'Volunteer Assigned' } : d));
    try {
      await volunteerApi.claimDelivery(id);
    } catch (err) {
      console.warn('[Volunteer Claim Notice]:', err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStep = async (id, step) => {
    setProcessingId(id);
    const newStatus = step === 'Picked Up' ? 'Picked Up' : 'Delivered';
    updateStoredStatus(id, newStatus);
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    try {
      await volunteerApi.updateStep(id, step);
    } catch (err) {
      console.warn('[Volunteer Step Notice]:', err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const assignedMissions = donations.filter(d => d.status === 'NGO Accepted' || d.status === 'Volunteer Assigned' || d.status === 'Picked Up');
  const historyMissions = donations.filter(d => d.status === 'Delivered' || d.status === 'Completed');

  const displayedMissions = currentTab === 'history' ? historyMissions : donations;

  return (
    <PortalLayout>
      <div className="space-y-8">
        
        {/* Volunteer Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              <Truck className="w-3.5 h-3.5" /> VOLUNTEER COURIER PORTAL
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">{profile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                REGISTERED COURIER
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Phone className="w-3.5 h-3.5" /> {profile.phone}
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Bike className="w-3.5 h-3.5" /> Bike No: <strong className="text-white">{profile.vehicle_number}</strong> ({profile.vehicle_type})
              </span>
              <span className="text-slate-400">Active Deliveries: {assignedMissions.length} • Rating: 4.9/5</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-blue-400" /> {isEditingProfile ? 'Close Profile' : 'Edit Courier Profile'}
            </button>
            <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Available
            </span>
          </div>
        </div>

        {/* Edit Courier Profile Form */}
        {isEditingProfile && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-6 shadow-2xl animate-in fade-in">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" /> Courier Registration Details
            </h2>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Registration / Bike Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA-01-EA-1234"
                  value={profile.vehicle_number}
                  onChange={(e) => setProfile({ ...profile, vehicle_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Type</label>
                <select
                  value={profile.vehicle_type}
                  onChange={(e) => setProfile({ ...profile, vehicle_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Two-Wheeler (Motorbike)">Two-Wheeler (Motorbike)</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Electric Bike">Electric Bike</option>
                  <option value="Car / Mini Van">Car / Mini Van</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-4 h-4" /> Save Courier Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Map Route Guidance */}
        {currentTab !== 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" /> Interactive Leaflet Route Navigation
            </h2>
            <InteractiveMap zoom={14} donations={donations} activeRoute={true} />
          </div>
        )}

        {/* Delivery Missions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Active Courier Missions
          </h2>

          {loading && donations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading delivery missions...</div>
          ) : displayedMissions.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No delivery missions assigned right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedMissions.map((item) => {
                const isCompleted = item.status === 'Delivered' || item.status === 'Completed';

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StatusBadge status={item.status} />
                        <span className="text-xs font-bold text-emerald-400">{item.quantity_kg} kg Food Package</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400">Donor: {item.restaurant_name || 'Royal Spice Bistro'}</p>
                      </div>

                      {/* Courier Information Badge */}
                      <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Assigned Courier</p>
                        <p className="text-slate-200 font-semibold">{profile.name} ({profile.phone})</p>
                        <p className="text-slate-400 text-[11px]">Bike No: <strong className="text-emerald-400">{profile.vehicle_number}</strong> • {profile.vehicle_type}</p>
                      </div>

                      {/* Route Timeline */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            A
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Pickup Restaurant</p>
                            <p className="font-medium text-slate-200">{item.pickup_address || 'Downtown Restaurant Hub'}</p>
                          </div>
                        </div>

                        <div className="w-0.5 h-4 bg-slate-800 ml-2.5"></div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            B
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Drop-off NGO Hub</p>
                            <p className="font-medium text-slate-200">Care & Share Foundation, 42 Hope Street</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mission Step Action Button */}
                    <div className="pt-2">
                      {item.status === 'NGO Accepted' && (
                        <button
                          onClick={() => handleClaim(item.id)}
                          disabled={processingId === item.id}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <Truck className="w-4 h-4" /> Claim Delivery Mission
                        </button>
                      )}

                      {item.status === 'Volunteer Assigned' && (
                        <button
                          onClick={() => handleUpdateStep(item.id, 'Picked Up')}
                          disabled={processingId === item.id}
                          className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Confirm Food Picked Up
                        </button>
                      )}

                      {item.status === 'Picked Up' && (
                        <button
                          onClick={() => handleUpdateStep(item.id, 'Delivered')}
                          disabled={processingId === item.id}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <PackageCheck className="w-4 h-4 text-slate-950" /> Confirm Delivered to NGO
                        </button>
                      )}

                      {isCompleted && (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Mission Completed & Delivered!
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PortalLayout>
  );
};

export default VolunteerDashboard;
