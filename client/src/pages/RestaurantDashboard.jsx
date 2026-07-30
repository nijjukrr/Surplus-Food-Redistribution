import React, { useState, useEffect } from 'react';
import { donationsApi, notificationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import PortalLayout from '../layouts/PortalLayout';
import { 
  Plus, 
  Utensils, 
  Clock, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  User,
  Bell,
  XCircle,
  CheckSquare
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const RestaurantDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Tab view from URL subpath or state
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

    notificationsApi.getNotifications()
      .then((res) => setNotifications(res.data.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchDonations();
  }, [location.pathname]);

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

  const activeDonations = donations.filter(d => d.status !== 'Completed' && d.status !== 'Delivered' && d.status !== 'Rejected');
  const historyDonations = donations.filter(d => d.status === 'Completed' || d.status === 'Delivered' || d.status === 'Rejected');

  return (
    <PortalLayout>
      <div className="space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
              <Utensils className="w-3.5 h-3.5" /> RESTAURANT DONOR PORTAL
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED DONOR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Manage surplus food donations and track AI freshness & delivery timelines.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Surplus Food Donation
          </button>
        </div>

        {/* Tab Specific Views */}
        {currentTab === 'donate' || isModalOpen ? (
          /* Donate Food Form Section */
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Submit Surplus Food Donation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Food Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Surplus Biryani & Curry Feast"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Food Weight (kg)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData({ ...formData, quantity_kg: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Food Category</label>
                  <select
                    value={formData.food_category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const categoryPresetImages = {
                        cooked_meal: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
                        bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
                        raw_produce: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80',
                        packaged_food: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
                      };
                      setFormData({ 
                        ...formData, 
                        food_category: cat, 
                        image_url: categoryPresetImages[cat] || categoryPresetImages.cooked_meal 
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cooked_meal">Hot Cooked Meal (Biryani / Curry)</option>
                    <option value="bakery">Bakery & Bread (Pastries / Loaves)</option>
                    <option value="raw_produce">Fresh Fruit & Produce (Apples / Veggies)</option>
                    <option value="packaged_food">Packaged Goods (Canned / Snacks)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Buffer (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    value={formData.expiry_hours}
                    onChange={(e) => setFormData({ ...formData, expiry_hours: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Address</label>
                <input
                  type="text"
                  required
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" /> {submitting ? 'Analyzing AI...' : 'Submit & Analyze AI'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Active & History Donations Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" /> Active Donations & Timeline Tracking
            </h2>
            <button onClick={fetchDonations} className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading donations...</div>
          ) : donations.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No donations created yet. Click "Add Surplus Food Donation" above to begin.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {donations.map((item) => {
                const prediction = item.ai_predictions?.[0] || item.ai_prediction || {};
                const confidence = prediction.confidenceScore || 95;

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
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={prediction.priority} score={prediction.urgency_score} />
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            {confidence}% AI Confidence
                          </span>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>

                      <div className="flex items-start gap-3">
                        <img
                          src={itemImage}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                          <p className="text-xs text-slate-400">{item.quantity_kg} kg Food Package</p>
                          {prediction.recommendedNGO && (
                            <p className="text-xs text-emerald-400 font-medium mt-1">
                              Matched NGO: {prediction.recommendedNGO}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Multi-Step Timeline Progress */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Donation Lifecycle Timeline</p>
                          <span className="text-[10px] text-emerald-400 font-bold">Realtime Pipeline</span>
                        </div>
                        <div className="grid grid-cols-5 text-[10px] font-semibold text-center gap-1">
                          <span className="text-emerald-400 font-bold">1. Submitted</span>
                          <span className="text-emerald-400 font-bold">2. AI Analysed</span>
                          <span className={item.status === 'Approved' || item.status === 'NGO Accepted' || item.status === 'Volunteer Assigned' || item.status === 'Picked Up' || item.status === 'Delivered' || item.status === 'Completed' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            3. Sent to NGO
                          </span>
                          <span className={item.status === 'NGO Accepted' || item.status === 'Volunteer Assigned' || item.status === 'Picked Up' || item.status === 'Delivered' || item.status === 'Completed' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            4. NGO Accepted
                          </span>
                          <span className={item.status === 'Delivered' || item.status === 'Completed' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            5. Delivered
                          </span>
                        </div>
                      </div>
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

export default RestaurantDashboard;
