import React, { useState, useEffect } from 'react';
import { ngoApi } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import PortalLayout from '../layouts/PortalLayout';
import { HeartHandshake, Sparkles, MapPin, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const NgoDashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchDonations = () => {
    setLoading(true);
    ngoApi.getNearby()
      .then((res) => {
        const list = res.data.data || [];
        // Sort high urgency score & priority first
        list.sort((a, b) => {
          const scoreA = a.ai_predictions?.[0]?.urgency_score || 50;
          const scoreB = b.ai_predictions?.[0]?.urgency_score || 50;
          return scoreB - scoreA;
        });
        setDonations(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDonations();
  }, [location.pathname]);

  const handleAccept = async (id) => {
    setProcessingId(id);
    try {
      await ngoApi.acceptDonation(id);
      fetchDonations();
    } catch (err) {
      alert('Failed to accept donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (id) => {
    setProcessingId(id);
    try {
      await ngoApi.denyDonation(id);
      fetchDonations();
    } catch (err) {
      alert('Failed to decline donation: ' + (err.response?.data?.message || err.message));
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
            <p className="text-xs text-slate-400 mt-1">Discover AI-prioritized surplus food donations nearby and accept for immediate community distribution.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-xs text-slate-500 font-medium">Daily Capacity</p>
              <p className="text-sm font-bold text-emerald-400">250 Beneficiaries</p>
            </div>
          </div>
        </div>

        {/* Available Donations Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> AI-Recommended Available Donations
            </h2>
            <span className="text-xs text-slate-400 font-medium">{displayedList.length} Active Listings</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Fetching nearby donations...</div>
          ) : displayedList.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No active food listings available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedList.map((item) => {
                const prediction = item.ai_predictions?.[0] || item.ai_prediction || {};
                const confidence = prediction.confidenceScore || 94;
                const isAccepted = item.status === 'NGO Accepted' || item.status === 'Volunteer Assigned' || item.status === 'Delivered' || item.status === 'Completed';

                const categoryImages = {
                  cooked_meal: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
                  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
                  raw_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
                  packaged_food: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
                };
                const genericOld = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                const itemImage = (!item.image_url || item.image_url === genericOld)
                  ? (categoryImages[item.food_category] || categoryImages.cooked_meal)
                  : item.image_url;

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between relative">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <PriorityBadge priority={prediction.priority} score={prediction.urgency_score} />
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          {confidence}% AI Confidence
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-slate-100">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.restaurant_name || 'Royal Spice Bistro'}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">
                          {item.quantity_kg} kg • ~{prediction.estimatedMeals || Math.round(item.quantity_kg * 3)} Meals
                        </p>
                      </div>

                      {/* AI Reasoning Insights */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                        <p className="text-[10px] text-emerald-400 font-bold uppercase">AI Recommendation Reason</p>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {prediction.reason || `Optimal freshness. Rescues ${item.quantity_kg}kg food safely before expiry.`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {item.pickup_address || 'Downtown Hub'}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-400">
                          <Clock className="w-3.5 h-3.5" /> Expires in 3.5 hrs
                        </span>
                      </div>
                    </div>

                    {/* NGO Action Buttons */}
                    <div className="pt-2">
                      {!isAccepted ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleDeny(item.id)}
                            disabled={processingId === item.id}
                            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-4 h-4 text-slate-400" /> Decline
                          </button>
                          <button
                            onClick={() => handleAccept(item.id)}
                            disabled={processingId === item.id}
                            className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Accept Request
                          </button>
                        </div>
                      ) : (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Accepted — Pickup Scheduled
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

export default NgoDashboard;
