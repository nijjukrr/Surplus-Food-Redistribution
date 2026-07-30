import React, { useState, useEffect } from 'react';
import { donationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import { Plus, Utensils, Clock, MapPin, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export const RestaurantDashboard = () => {
  const { role, setRole } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    food_category: 'cooked_meal',
    food_type: 'veg',
    quantity_kg: 20,
    expiry_hours: 4,
    pickup_address: '108 Grand Avenue, Downtown',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  });

  const fetchDonations = () => {
    setLoading(true);
    donationsApi.getAll()
      .then((res) => {
        setDonations(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (role !== 'restaurant' && role !== 'admin') {
      setRole('restaurant');
    }
    fetchDonations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const expiry_time = new Date(Date.now() + formData.expiry_hours * 3600000).toISOString();
      await donationsApi.create({
        ...formData,
        expiry_time
      });

      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        food_category: 'cooked_meal',
        food_type: 'veg',
        quantity_kg: 20,
        expiry_hours: 4,
        pickup_address: '108 Grand Avenue, Downtown',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      });
      fetchDonations();
    } catch (err) {
      alert('Error creating donation: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            <Utensils className="w-3.5 h-3.5" /> RESTAURANT DONOR PORTAL
          </div>
          <h1 className="text-3xl font-extrabold text-white">Royal Spice Bistro</h1>
          <p className="text-xs text-slate-400 mt-1">Manage surplus food donations and track AI match & delivery statuses.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Surplus Food Donation
        </button>
      </div>

      {/* Donation History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Donation History & Realtime Tracking
          </h2>
          <button onClick={fetchDonations} className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Loading donations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((item) => {
              const prediction = item.ai_predictions?.[0] || item.ai_prediction || {};
              return (
                <div key={item.id} className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 space-y-4 relative flex flex-col justify-between">
                  <div className="space-y-3">
                    
                    {/* Top Status & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={item.status} />
                      <PriorityBadge priority={prediction.priority} score={prediction.urgency_score} />
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start gap-3 pt-2">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-slate-400 capitalize">{item.food_category.replace('_', ' ')} • {item.food_type}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">{item.quantity_kg} kg</p>
                      </div>
                    </div>

                    {/* AI Insights Card */}
                    {prediction.reason && (
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                        <div className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Gemini AI Insight
                        </div>
                        <p className="text-slate-300 text-[11px] leading-tight">{prediction.reason}</p>
                        {prediction.estimated_meals && (
                          <span className="text-[10px] font-bold text-emerald-400 block pt-1">
                            Impact: ~{prediction.estimated_meals} meals served
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {item.pickup_address}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
                    <span>Created: {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="font-semibold text-slate-400">{item.restaurant_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" /> Add Food Donation
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-lg">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Food Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25kg Surplus Vegetable Biryani"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData({ ...formData, quantity_kg: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expiry Hours</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.expiry_hours}
                    onChange={(e) => setFormData({ ...formData, expiry_hours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.food_category}
                    onChange={(e) => setFormData({ ...formData, food_category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="cooked_meal">Cooked Meal</option>
                    <option value="bakery">Bakery Items</option>
                    <option value="raw_produce">Raw Produce / Fruits</option>
                    <option value="packaged_food">Packaged Food</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Food Type</label>
                  <select
                    value={formData.food_type}
                    onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non_veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Food Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? 'Analyzing with AI...' : 'Submit & Analyze with Gemini'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default RestaurantDashboard;
