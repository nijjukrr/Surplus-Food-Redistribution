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
import CoimbatoreMap from '../components/CoimbatoreMap';

export const LandingPage = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-white selection:text-slate-950">
      <Navbar />

      <div className="space-y-24 pb-20">
        
        {/* Hero / About Section */}
        <section id="about" className="relative pt-16 pb-20 overflow-hidden">
          {/* Background Video (100% Opacity, As-Is) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/explanation_video.mp4" type="video/mp4" />
          </video>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 text-cyan-300 text-xs font-bold mb-2 shadow-2xl border border-cyan-500/40 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next-Gen Smart Food Redistribution Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-2xl">
              Bridging Surplus Food to <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Hungry Communities with AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-100 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg bg-slate-950/80 p-5 rounded-2xl backdrop-blur-md border border-slate-800/80 shadow-2xl">
              FoodBridge AI empowers communities by connecting commercial food surplus with local charities and volunteer couriers in real-time. Using AI freshness evaluations, we turn potential food waste into immediate, nutritious meals for families in need.
            </p>

            {/* Key Impact Stats */}
            <div id="stats" className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: 'Food Rescued', value: '1,250 kg+', color: 'text-white' },
                { label: 'Meals Served', value: '3,750+', color: 'text-slate-100' },
                { label: 'Active NGOs', value: '42 Hubs', color: 'text-slate-200' },
                { label: 'AI Confidence Score', value: '96.4%', color: 'text-white' },
              ].map((stat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg">
                  <p className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* How FoodBridge Works Visual Diagram Section */}
        <section id="how-it-works" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-slate-800 shadow-2xl max-w-7xl mx-auto">
          {/* Background Video (2nd explanation video - 100% Opacity, Edge-to-Edge) */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source src="/explanation_video_2.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10 space-y-10">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 text-cyan-300 text-xs font-extrabold shadow-2xl border border-cyan-500/40 backdrop-blur-md">
                <Clock className="w-4 h-4 text-cyan-400" /> END-TO-END LOGISTICS WORKFLOW
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl">How FoodBridge AI Works</h2>
              <p className="text-slate-100 text-sm max-w-xl mx-auto font-medium drop-shadow-lg bg-slate-950/70 py-2 px-4 rounded-full border border-slate-800/80 backdrop-blur-md inline-block">
                From surplus preparation to community distribution, AI handles real-time freshness and logistics routing.
              </p>
            </div>

            {/* 3D ELECTRIC CARDS OVER VIDEO (NO WHITE COLOR) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { step: '1', title: 'Upload Surplus Food', desc: 'Restaurant details food quantity, category, and expiry.', icon: Utensils },
                { step: '2', title: 'AI Freshness & Urgency', desc: 'Gemini AI evaluates priority score & confidence %.', icon: Sparkles },
                { step: '3', title: 'Smart NGO Recommendation', desc: 'Verified donations stream directly to nearby NGOs.', icon: HeartHandshake },
                { step: '4', title: 'Volunteer Courier Pickup', desc: 'Courier claims mission & follows interactive route.', icon: Truck },
                { step: '5', title: 'Community Distribution', desc: 'Food is delivered safely to beneficiaries.', icon: CheckCircle2 },
              ].map((item, idx) => {
                const StepIcon = item.icon;
                return (
                  <div 
                    key={idx} 
                    className="relative p-6 rounded-3xl bg-slate-950/85 backdrop-blur-2xl border border-cyan-500/40 text-white flex flex-col justify-between space-y-4 hover:-translate-y-3 hover:scale-105 transition-all duration-300 transform-gpu perspective-1000 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_45px_rgba(6,182,212,0.75)] hover:border-cyan-400 group overflow-hidden"
                  >
                    {/* Top Electric Neon Pulse Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse"></div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                          {item.step}
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_#22d3ee]">
                          <StepIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="font-black text-sm text-white group-hover:text-cyan-200 transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] leading-tight">{item.title}</h3>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed drop-shadow-sm">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Coimbatore Interactive NGO & Charity Map Section */}
        <section id="coimbatore-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> LIVE REGIONAL LOGISTICS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Coimbatore NGO & Charity Network Map
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Real-time interactive map locating verified NGOs, charity shelters, and surplus food pickup points across Coimbatore (RS Puram, Gandhipuram, Singanallur, Kovaipudur, Saravanampatti...).
            </p>
          </div>

          <CoimbatoreMap heightClass="h-[500px]" />
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
              { 
                role: 'restaurant', 
                title: 'Restaurant Portal', 
                desc: 'Donate surplus food, view AI freshness analysis, & track delivery timelines.', 
                icon: Building2, 
                theme: {
                  border: 'border-emerald-500/40 hover:border-emerald-400',
                  glow: 'shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:shadow-[0_0_45px_rgba(52,211,153,0.7)]',
                  pulse: 'via-emerald-400 shadow-[0_0_12px_#34d399]',
                  iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 group-hover:bg-emerald-400 group-hover:text-slate-950 group-hover:shadow-[0_0_20px_#34d399]',
                  btnText: 'text-emerald-400 group-hover:text-emerald-300'
                }
              },
              { 
                role: 'ngo', 
                title: 'NGO / Charity Hub', 
                desc: 'Browse AI-recommended food, accept or decline requests, & schedule pickup times.', 
                icon: HeartHandshake, 
                theme: {
                  border: 'border-rose-500/40 hover:border-rose-400',
                  glow: 'shadow-[0_0_25px_rgba(251,113,133,0.3)] hover:shadow-[0_0_45px_rgba(251,113,133,0.7)]',
                  pulse: 'via-rose-400 shadow-[0_0_12px_#fb7185]',
                  iconBg: 'bg-rose-950/80 border-rose-500/40 text-rose-300 group-hover:bg-rose-400 group-hover:text-slate-950 group-hover:shadow-[0_0_20px_#fb7185]',
                  btnText: 'text-rose-400 group-hover:text-rose-300'
                }
              },
              { 
                role: 'volunteer', 
                title: 'Volunteer Courier', 
                desc: 'Claim delivery missions, navigate interactive maps, & confirm pickups.', 
                icon: Truck, 
                theme: {
                  border: 'border-cyan-500/40 hover:border-cyan-400',
                  glow: 'shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)]',
                  pulse: 'via-cyan-400 shadow-[0_0_12px_#22d3ee]',
                  iconBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 group-hover:shadow-[0_0_20px_#22d3ee]',
                  btnText: 'text-cyan-400 group-hover:text-cyan-300'
                }
              },
              { 
                role: 'admin', 
                title: 'Admin Control Center', 
                desc: 'Verify restaurants, review flagged items, & monitor platform analytics.', 
                icon: ShieldCheck, 
                theme: {
                  border: 'border-purple-500/40 hover:border-purple-400',
                  glow: 'shadow-[0_0_25px_rgba(192,132,252,0.3)] hover:shadow-[0_0_45px_rgba(192,132,252,0.7)]',
                  pulse: 'via-purple-400 shadow-[0_0_12px_#c084fc]',
                  iconBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300 group-hover:bg-purple-400 group-hover:text-slate-950 group-hover:shadow-[0_0_20px_#c084fc]',
                  btnText: 'text-purple-400 group-hover:text-purple-300'
                }
              },
            ].map((p, idx) => {
              const PortalIcon = p.icon;
              const t = p.theme;
              return (
                <Link
                  key={idx}
                  to={`/login?role=${p.role}`}
                  className={`relative p-6 rounded-3xl bg-slate-950/85 backdrop-blur-2xl border ${t.border} ${t.glow} space-y-4 flex flex-col justify-between group hover:-translate-y-3 hover:scale-105 transition-all duration-300 transform-gpu perspective-1000 overflow-hidden`}
                >
                  <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent ${t.pulse} to-transparent animate-pulse`}></div>

                  <div className="space-y-3 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl ${t.iconBg} flex items-center justify-center transition-all duration-300`}>
                      <PortalIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-base text-white group-hover:text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{p.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{p.desc}</p>
                  </div>

                  <div className={`pt-2 flex items-center justify-between text-xs font-black ${t.btnText} relative z-10`}>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
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
