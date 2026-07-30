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
  Clock,
  CheckCircle2,
  Building2,
  HeartHandshake
} from 'lucide-react';
import Navbar from '../components/Navbar';

export const LandingPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <div className="space-y-24 pb-20">
        
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),rgba(255,255,255,0))] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Next-Gen Smart Food Redistribution Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Bridging Surplus Food to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Hungry Communities with AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              FoodBridge AI empowers communities by connecting commercial food surplus with local charities and volunteer couriers in real-time. Using AI freshness evaluations, we turn potential food waste into immediate, nutritious meals for families in need.
            </p>

            {/* Key Impact Stats */}
            <div id="stats" className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Food Rescued', value: '1,250 kg+', color: 'text-emerald-400' },
                { label: 'Meals Served', value: '3,750+', color: 'text-teal-300' },
                { label: 'Active NGOs', value: '42 Hubs', color: 'text-amber-400' },
                { label: 'AI Confidence Score', value: '96.4%', color: 'text-indigo-400' },
              ].map((stat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <p className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* How FoodBridge Works Visual Diagram Section */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Clock className="w-3.5 h-3.5" /> END-TO-END LOGISTICS WORKFLOW
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How FoodBridge AI Works</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              From surplus preparation to community distribution, AI handles real-time freshness and logistics routing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '1', title: 'Upload Surplus Food', desc: 'Restaurant details food quantity, category, and expiry.', icon: Utensils, color: 'border-emerald-500/40 text-emerald-400' },
              { step: '2', title: 'AI Freshness & Urgency', desc: 'Gemini AI evaluates priority score & confidence %.', icon: Sparkles, color: 'border-teal-500/40 text-teal-400' },
              { step: '3', title: 'Smart NGO Recommendation', desc: 'Verified donations stream directly to nearby NGOs.', icon: HeartHandshake, color: 'border-rose-500/40 text-rose-400' },
              { step: '4', title: 'Volunteer Courier Pickup', desc: 'Courier claims mission & follows interactive route.', icon: Truck, color: 'border-blue-500/40 text-blue-400' },
              { step: '5', title: 'Community Distribution', desc: 'Food is delivered safely to beneficiaries.', icon: CheckCircle2, color: 'border-amber-500/40 text-amber-400' },
            ].map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div key={idx} className={`p-6 rounded-2xl bg-slate-900/80 border ${item.color} flex flex-col justify-between relative group hover:scale-[1.02] transition-transform`}>
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      {item.step}
                    </div>
                    <StepIcon className={`w-6 h-6 ${item.color.split(' ')[1]}`} />
                    <h3 className="font-bold text-sm text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Choose Your Portal Section */}
        <section id="portals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Building2 className="w-3.5 h-3.5" /> DEDICATED ROLE PORTALS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Portal Gateway</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Select your persona role to access your dedicated SaaS dashboard environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: 'restaurant', title: 'Restaurant Portal', desc: 'Donate surplus food, view AI freshness analysis, & track delivery timelines.', icon: Building2, color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
              { role: 'ngo', title: 'NGO / Charity Hub', desc: 'Browse AI-recommended food, accept or decline requests, & schedule pickup times.', icon: HeartHandshake, color: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400' },
              { role: 'volunteer', title: 'Volunteer Courier', desc: 'Claim delivery missions, navigate interactive maps, & confirm pickups.', icon: Truck, color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400' },
              { role: 'admin', title: 'Admin Control Center', desc: 'Verify restaurants, review flagged items, & monitor platform analytics.', icon: ShieldCheck, color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400' },
            ].map((p, idx) => {
              const PortalIcon = p.icon;
              return (
                <Link
                  key={idx}
                  to={`/login?role=${p.role}`}
                  className={`p-6 rounded-3xl bg-gradient-to-br ${p.color} border space-y-4 flex flex-col justify-between group hover:scale-[1.03] transition-all shadow-xl`}
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                      <PortalIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-white">{p.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold">
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>FoodBridge AI — Smart Surplus Food Redistribution Platform</p>
        <p className="text-[10px] text-slate-600">Built with React, Vite, Node.js, Supabase & Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default LandingPage;
