import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Utensils, 
  Heart, 
  Truck, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Award,
  Clock
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

export const LandingPage = () => {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Next-Gen Smart Food Redistribution Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Bridging Surplus Food to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Hungry Communities with AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            FoodBridge AI uses Google Gemini AI & Supabase to analyze food freshness, calculate priority scores, and match surplus donations from restaurants with nearby NGOs and volunteer couriers in real-time.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/restaurant"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Utensils className="w-4 h-4" />
              Donate Surplus Food
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ngo"
              className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              Claim Donations as NGO
            </Link>
          </div>

          {/* Key Impact Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Food Rescued', value: '1,250 kg+', color: 'text-emerald-400' },
              { label: 'Meals Served', value: '3,750+', color: 'text-teal-300' },
              { label: 'Active NGOs', value: '42 Hubs', color: 'text-amber-400' },
              { label: 'AI Match Accuracy', value: '96.4%', color: 'text-indigo-400' },
            ].map((stat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <p className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AI Intelligence Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" /> GEMINI AI REDISTRIBUTION ENGINE
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Predictive Prioritization & Smart NGO Matching
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                When a restaurant submits surplus food, Gemini AI processes quantity, category, cooked timestamp, and shelf-life. It calculates an exact Urgency Score, estimates nutritious meal count, and matches with the best nearby NGO.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Expiry Urgency Score', desc: 'Predicts high-risk food expiring under 4 hours.' },
                  { title: 'Nutritional Meal Estimation', desc: 'Converts bulk kg measurements into actual meal units.' },
                  { title: 'Automated NGO Recommendation', desc: 'Matches capacity and proximity to minimize delivery lag.' }
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{feat.title}</h4>
                      <p className="text-xs text-slate-400">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Mock Card Preview */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400">Gemini AI Output Live Preview</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  HIGH PRIORITY (92%)
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Estimated Meals:</span>
                  <span className="font-bold text-emerald-400">75 Meals (~25 kg)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Best NGO Match:</span>
                  <span className="font-semibold text-slate-200">Care & Share Foundation (0.8 km)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Time Buffer:</span>
                  <span className="font-semibold text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 2.5 hours remaining
                  </span>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-snug italic">
                  "Urgent: Cooked Biryani & Curry expires in 2.5 hrs. High volume ready for immediate feeding drive."
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> Real-time Redistribution Map
            </h2>
            <p className="text-xs text-slate-400 mt-1">Live tracking of food donation origins, NGO receiving hubs, and volunteer courier routes.</p>
          </div>
          <Link to="/volunteer" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
            View Active Delivery Routes <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <InteractiveMap zoom={13} activeRoute={true} />
      </section>

    </div>
  );
};

export default LandingPage;
