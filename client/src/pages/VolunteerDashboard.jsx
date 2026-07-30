import React, { useState, useEffect } from 'react';
import { volunteerApi, donationsApi } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import InteractiveMap from '../components/InteractiveMap';
import PortalLayout from '../layouts/PortalLayout';
import { Truck, MapPin, CheckCircle2, Navigation, ShieldCheck, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const VolunteerDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDonation, setActiveDonation] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchMissions = () => {
    setLoading(true);
    donationsApi.getAll()
      .then((res) => {
        const list = res.data.data || [];
        setDonations(list);
        if (list.length > 0 && !activeDonation) {
          setActiveDonation(list[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMissions();
  }, [location.pathname]);

  const handleClaim = async (id) => {
    setProcessingId(id);
    try {
      await volunteerApi.claimDelivery(id);
      fetchMissions();
    } catch (err) {
      alert('Error claiming delivery: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleUpdateStep = async (id, step) => {
    setProcessingId(id);
    try {
      await volunteerApi.updateStep(id, step);
      fetchMissions();
    } catch (err) {
      alert('Error updating delivery step: ' + (err.response?.data?.message || err.message));
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
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-2">
              <Truck className="w-3.5 h-3.5" /> VOLUNTEER COURIER PORTAL
            </div>
            <h1 className="text-3xl font-extrabold text-white">Alex Rivera</h1>
            <p className="text-xs text-slate-400 mt-1">Vehicle: Two-Wheeler • Active Deliveries: {assignedMissions.length} • Rating: 4.9/5</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Available for Deliveries
            </span>
          </div>
        </div>

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

          {loading ? (
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
                          <CheckCircle2 className="w-4 h-4" /> Confirm Delivered to NGO
                        </button>
                      )}

                      {isCompleted && (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Mission Completed Successfully!
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
