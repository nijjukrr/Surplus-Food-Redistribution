import React, { useState, useEffect } from 'react';
import { ngoApi, donationsApi } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { HeartHandshake, Sparkles, MapPin, CheckCircle2, Clock, Award } from 'lucide-react';

export const NgoDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

  const fetchDonations = () => {
    setLoading(true);
    ngoApi.getNearby()
      .then((res) => {
        const list = res.data.data || [];
        // Sort high priority & urgency first
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
  }, []);

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      await ngoApi.acceptDonation(id);
      fetchDonations();
    } catch (err) {
      alert('Failed to accept donation: ' + err.message);
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* NGO Header */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" /> NGO BENEFICIARY PORTAL
          </div>
          <h1 className="text-3xl font-extrabold text-white">Care & Share Foundation</h1>
          <p className="text-xs text-slate-400 mt-1">Discover AI-prioritized surplus food donations nearby and accept for immediate distribution.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Daily Capacity</p>
            <p className="text-sm font-bold text-emerald-400">250 Beneficiaries</p>
          </div>
        </div>
      </div>

      {/* AI Prioritized Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> AI-Prioritized Available Donations
          </h2>
          <span className="text-xs text-slate-400 font-medium">{donations.length} Active Listings</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Fetching nearby donations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => {
              const prediction = item.ai_predictions?.[0] || item.ai_prediction || {};
              const isAccepted = item.status === 'NGO Accepted' || item.status === 'Volunteer Assigned' || item.status === 'Delivered' || item.status === 'Completed';

              return (
                <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between relative">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <PriorityBadge priority={prediction.priority} score={prediction.urgency_score} />
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="flex items-start gap-3">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                        <p className="text-xs text-slate-400">{item.restaurant_name}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">{item.quantity_kg} kg • ~{prediction.estimated_meals || Math.round(item.quantity_kg * 3)} Meals</p>
                      </div>
                    </div>

                    {/* AI Recommendation Box */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <div className="font-bold text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> AI Priority Match Rationale
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {prediction.reason || `Calculated ${item.quantity_kg}kg surplus food ready for immediate distribution.`}
                      </p>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {item.pickup_address}
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="pt-4 border-t border-slate-800">
                    {isAccepted ? (
                      <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Claimed by {prediction.recommended_ngo_name || 'Care & Share'}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAccept(item.id)}
                        disabled={acceptingId === item.id}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        <Award className="w-4 h-4" />
                        {acceptingId === item.id ? 'Claiming Donation...' : 'Accept & Claim Donation'}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default NgoDashboard;
