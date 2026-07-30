import React, { useState, useEffect } from 'react';
import { ngoApi, donationsApi } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import PortalLayout from '../layouts/PortalLayout';
import { HeartHandshake, CheckCircle2, XCircle, Sparkles, MapPin, Clock, Truck, User, Phone, Bike, FileText } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { getStoredDrivers } from '../services/driverService';

const getStoredDonations = () => {
  try {
    const saved = localStorage.getItem('foodbridge_custom_donations');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const updateStoredItem = (id, updates) => {
  const existing = getStoredDonations();
  const updated = existing.map(d => d.id === id ? { ...d, ...updates } : d);
  localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
};

export const NgoDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState(getStoredDonations());
  const [availableDrivers, setAvailableDrivers] = useState(getStoredDrivers());
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState({});

  const fetchDonations = () => {
    setLoading(true);
    setAvailableDrivers(getStoredDrivers());
    const savedCustom = getStoredDonations();
    ngoApi.getNearby()
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
    fetchDonations();
  }, [location.pathname]);

  const handleAccept = async (id) => {
    setProcessingId(id);
    updateStoredItem(id, { status: 'NGO Accepted' });
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'NGO Accepted' } : d));
    try {
      await ngoApi.acceptDonation(id);
    } catch (err) {
      console.warn('[NGO Accept Notice]:', err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleAssignDriver = (donationId) => {
    const driverId = selectedDrivers[donationId] || availableDrivers[0].id;
    const driverObj = availableDrivers.find(d => d.id === driverId) || availableDrivers[0];

    updateStoredItem(donationId, {
      status: 'Volunteer Assigned',
      assigned_driver: driverObj
    });

    setDonations(prev => prev.map(d => d.id === donationId ? {
      ...d,
      status: 'Volunteer Assigned',
      assigned_driver: driverObj
    } : d));
  };

  const handleDeny = async (id) => {
    setProcessingId(id);
    updateStoredItem(id, { status: 'Reoffered to Next NGO' });
    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: 'Reoffered to Next NGO' } : d));
    try {
      await ngoApi.denyDonation(id);
    } catch (err) {
      console.warn('[NGO Deny Notice]:', err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const availableDonations = donations.filter(d => d.status === 'Approved' || d.status === 'Created' || d.status === 'AI Analysed');
  const acceptedDonations = donations.filter(d => d.status === 'NGO Accepted' || d.status === 'Volunteer Assigned');
  const historyDonations = donations.filter(d => d.status === 'Delivered' || d.status === 'Completed');

  const displayedList = currentTab === 'accepted' ? acceptedDonations 
                      : currentTab === 'history' ? historyDonations 
                      : availableDonations.length > 0 ? availableDonations : donations;

  return (
    <PortalLayout>
      <div className="space-y-8">
        
        {/* NGO Header */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 mb-2">
              <HeartHandshake className="w-3.5 h-3.5" /> NGO BENEFICIARY PORTAL
            </div>
            <h1 className="text-3xl font-extrabold text-white">Care & Share Foundation</h1>
            <p className="text-xs text-slate-400 mt-1">Accept surplus food donations and assign registered delivery partner drivers for pickup.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              Active Partner Status: Verified
            </span>
          </div>
        </div>

        {/* Available & Accepted Donations Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> 
              {currentTab === 'accepted' ? 'Accepted Donations & Driver Assignment' : 'Surplus Food Listings'}
            </h2>
            <span className="text-xs text-slate-400 font-medium">{displayedList.length} Listings</span>
          </div>

          {loading && donations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">Fetching nearby donations...</div>
          ) : displayedList.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No food listings available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedList.map((item) => {
                const prediction = item.ai_predictions?.[0] || item.ai_prediction || {};
                const confidence = prediction.confidenceScore || 94;
                const isAccepted = item.status === 'NGO Accepted';
                const isAssigned = item.status === 'Volunteer Assigned' || item.status === 'Picked Up' || item.status === 'Delivered' || item.status === 'Completed';

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between relative">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <PriorityBadge priority={prediction.priority} score={prediction.urgency_score} />
                        <StatusBadge status={item.status} />
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-slate-100">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.restaurant_name || 'Royal Spice Bistro'}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">
                          {item.quantity_kg} kg • ~{prediction.estimatedMeals || Math.round(item.quantity_kg * 3)} Meals
                        </p>
                      </div>

                      {/* AI Reasoning Insights */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>AI Route Match</span>
                          <span className="text-emerald-400">1.5 km away</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">
                          {prediction.reason || 'High priority food package available for pickup.'}
                        </p>
                      </div>

                      <div className="text-xs text-slate-400 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>Pickup: {item.pickup_address || 'Downtown Restaurant District'}</span>
                        </div>
                      </div>

                      {/* Driver Assignment Section for Accepted Food */}
                      {isAccepted && (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-3 pt-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                            <Truck className="w-4 h-4" /> NGO Driver Assignment
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Select Delivery Partner Driver</label>
                            <select
                              value={selectedDrivers[item.id] || availableDrivers[0].id}
                              onChange={(e) => setSelectedDrivers({ ...selectedDrivers, [item.id]: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                            >
                              {availableDrivers.map(drv => (
                                <option key={drv.id} value={drv.id}>
                                  {drv.name} ({drv.bike})
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleAssignDriver(item.id)}
                            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                          >
                            <Truck className="w-4 h-4" /> Assign Driver for Pickup
                          </button>
                        </div>
                      )}

                      {/* Driver Assigned Card Badge */}
                      {isAssigned && (
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 text-xs space-y-1">
                          <p className="text-[10px] font-bold uppercase text-blue-400">Assigned Driver Courier</p>
                          <p className="text-slate-200 font-bold">{item.assigned_driver?.name || 'Alex Rivera'}</p>
                          <p className="text-[11px] text-slate-400">Bike No: <strong className="text-emerald-400">{item.assigned_driver?.bike || 'KA-01-EA-1234'}</strong> • Phone: {item.assigned_driver?.phone || '+91 98765 43210'}</p>
                          <p className="text-[10px] text-slate-500">Aadhar: {item.assigned_driver?.aadhar || '1234-5678-9012'}</p>
                        </div>
                      )}
                    </div>

                    {/* NGO Action Buttons */}
                    <div className="pt-2">
                      {!isAccepted && !isAssigned ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleDeny(item.id)}
                            disabled={processingId === item.id}
                            className="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Decline
                          </button>

                          <button
                            onClick={() => handleAccept(item.id)}
                            disabled={processingId === item.id}
                            className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Accept Food
                          </button>
                        </div>
                      ) : null}
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

export default NgoDashboard;
