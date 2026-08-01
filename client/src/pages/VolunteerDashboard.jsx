import React, { useState, useEffect } from 'react';
import { volunteerApi, donationsApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import InteractiveMap from '../components/InteractiveMap';
import PortalLayout from '../layouts/PortalLayout';
import { getStoredDrivers, registerNewDriver } from '../services/driverService';
import { Truck, CheckCircle2, Navigation, User, Phone, Bike, Edit3, Save, PackageCheck, ShieldCheck, FileText, UserPlus, Users, Image, Bell, Bus, Clock, MapPin, Sparkles, AlertTriangle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { findOptimalNgoForPickup } from '../services/ngoMatchingService';
import { findNearestBusStop } from '../data/coimbatoreBusStops';

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
  const { user } = useAuth();
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'home';

  const [donations, setDonations] = useState(getStoredDonations());
  const [drivers, setDrivers] = useState(getStoredDrivers());
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [isRegisteringDriver, setIsRegisteringDriver] = useState(false);

  // Active Selected Driver State
  const [activeDriver, setActiveDriver] = useState(() => {
    const allDrivers = getStoredDrivers();
    const savedName = localStorage.getItem('foodbridge_user_name') || user?.name || 'VIJAY';
    const matched = allDrivers.find(d => d.name?.toUpperCase() === savedName?.toUpperCase()) || allDrivers[0];
    return matched;
  });

  useEffect(() => {
    const allDrivers = getStoredDrivers();
    const savedName = localStorage.getItem('foodbridge_user_name') || user?.name;
    if (savedName) {
      const matched = allDrivers.find(d => d.name?.toUpperCase() === savedName?.toUpperCase());
      if (matched && matched.name !== activeDriver.name) {
        setActiveDriver(matched);
      }
    }
  }, [user?.name]);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    dob: '1998-01-01',
    bike: '',
    vehicle_type: 'Two-Wheeler (Motorbike)',
    aadhar: '',
    photo_url: '/drivers/Screenshot 2026-07-31 205255.png'
  });

  const handleRegisterDriver = (e) => {
    e.preventDefault();
    const created = registerNewDriver(regForm);
    const updatedList = getStoredDrivers();
    setDrivers(updatedList);
    setActiveDriver(created);
    setIsRegisteringDriver(false);
    setRegForm({
      name: '',
      phone: '',
      dob: '1998-01-01',
      bike: '',
      vehicle_type: 'Two-Wheeler (Motorbike)',
      aadhar: '',
      photo_url: '/drivers/Screenshot 2026-07-31 205255.png'
    });
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

  const handleAcceptMission = (donation) => {
    setProcessingId(donation.id);

    // Calculate Smart NGO Match based on duration, food availability, & distance
    const optimalMatch = findOptimalNgoForPickup(donation);
    const busStop = findNearestBusStop(donation.pickup_address);

    const updatedDonation = {
      ...donation,
      status: 'Volunteer Assigned',
      assigned_driver: activeDriver,
      bus_stop_name: donation.bus_stop_name || busStop.name,
      bus_stop_landmark: donation.bus_stop_landmark || busStop.landmark,
      matched_ngo: optimalMatch.matchedNgo,
      route_details: optimalMatch.routeDetails,
      accepted_at: new Date().toISOString()
    };

    // Save updated custom donation with matched NGO
    const existing = getStoredDonations();
    const updatedList = existing.map(d => d.id === donation.id ? updatedDonation : d);
    if (!existing.some(d => d.id === donation.id)) {
      updatedList.unshift(updatedDonation);
    }
    localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updatedList));

    setDonations(prev => prev.map(d => d.id === donation.id ? updatedDonation : d));
    setProcessingId(null);
  };

  const [activeDropRouteModal, setActiveDropRouteModal] = useState(null);

  const playNotificationAudio = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleUpdateStep = async (id, step) => {
    setProcessingId(id);
    const newStatus = step === 'Picked Up' ? 'Picked Up' : 'Delivered';
    updateStoredStatus(id, newStatus);
    
    // Target donation item for AI Drop matching
    const targetItem = donations.find(d => d.id === id);
    if (step === 'Picked Up' && targetItem) {
      const optimalMatch = findOptimalNgoForPickup(targetItem);
      const busStop = findNearestBusStop(targetItem.pickup_address);

      const pickupLat = targetItem.lat || targetItem.pickup_lat || 11.0090;
      const pickupLng = targetItem.lng || targetItem.pickup_lng || 76.9530;
      const ngoLat = optimalMatch.matchedNgo.lat;
      const ngoLng = optimalMatch.matchedNgo.lng;

      const dropModalData = {
        item: targetItem,
        busStopName: targetItem.bus_stop_name || busStop.name,
        matchedNgo: optimalMatch.matchedNgo,
        routeInfo: optimalMatch.routeDetails,
        routePoints: [[pickupLat, pickupLng], [ngoLat, ngoLng]]
      };

      setActiveDropRouteModal(dropModalData);
      playNotificationAudio();
    }

    setDonations(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    try {
      await volunteerApi.updateStep(id, step);
    } catch (err) {
      console.warn('[Volunteer Step Notice]:', err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const [handoverModalDonation, setHandoverModalDonation] = useState(null);
  const [targetTransferDriverId, setTargetTransferDriverId] = useState('');

  const handleRequestHandover = (donationId) => {
    const targetDrv = drivers.find(d => d.id === targetTransferDriverId);
    if (!targetDrv) return;

    const existing = getStoredDonations();
    const updated = existing.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          handover_request: {
            from_driver: activeDriver.name,
            to_driver: targetDrv.name,
            to_driver_obj: targetDrv,
            status: 'pending',
            requested_at: new Date().toLocaleTimeString()
          }
        };
      }
      return d;
    });
    localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setDonations(updated);
    setHandoverModalDonation(null);
    setTargetTransferDriverId('');
    alert(`Handover request sent to Driver ${targetDrv.name}. Once ${targetDrv.name} accepts, the order will be transferred!`);
  };

  const handleAcceptHandover = (donation) => {
    const existing = getStoredDonations();
    const updated = existing.map(d => {
      if (d.id === donation.id) {
        return {
          ...d,
          assigned_driver: activeDriver,
          handover_request: {
            ...d.handover_request,
            status: 'accepted'
          }
        };
      }
      return d;
    });
    localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setDonations(updated);
    alert(`You have accepted handover of Order "${donation.title}". It is now in your active missions!`);
  };

  const handleDeclineHandover = (donation) => {
    const existing = getStoredDonations();
    const updated = existing.map(d => {
      if (d.id === donation.id) {
        return {
          ...d,
          handover_request: {
            ...d.handover_request,
            status: 'declined'
          }
        };
      }
      return d;
    });
    localStorage.setItem('foodbridge_custom_donations', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setDonations(updated);
  };

  const availableDonations = donations.filter(d => d.status === 'Approved' || d.status === 'Pending' || d.status === 'New');
  const assignedMissions = donations.filter(d => 
    (d.assigned_driver?.name?.toUpperCase() === activeDriver.name?.toUpperCase() || d.assigned_driver?.id === activeDriver.id) && 
    (d.status === 'Volunteer Assigned' || d.status === 'Picked Up')
  );
  const historyMissions = donations.filter(d => 
    (d.assigned_driver?.name?.toUpperCase() === activeDriver.name?.toUpperCase() || d.assigned_driver?.id === activeDriver.id) &&
    (d.status === 'Delivered' || d.status === 'Completed')
  );

  const pendingHandoverRequests = donations.filter(d => 
    d.handover_request && 
    d.handover_request.to_driver?.toUpperCase() === activeDriver.name?.toUpperCase() && 
    d.handover_request.status === 'pending'
  );

  const displayedMissions = currentTab === 'history' ? historyMissions : assignedMissions;

  return (
    <PortalLayout>
      <div className="space-y-8">

        {/* Incoming Handover Transfer Request Banner */}
        {pendingHandoverRequests.length > 0 && (
          <div className="space-y-3">
            {pendingHandoverRequests.map((reqDonation) => (
              <div key={reqDonation.id} className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-amber-300">⚡ INCOMING ORDER HANDOVER REQUEST</p>
                    <p className="text-xs text-slate-200">
                      Driver <strong className="text-white">{reqDonation.handover_request.from_driver}</strong> requested to transfer Order <strong className="text-amber-300">"{reqDonation.title}"</strong> ({reqDonation.quantity_kg} kg) to you.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleAcceptHandover(reqDonation)}
                    className="flex-1 md:flex-initial py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg transition-transform hover:scale-[1.03]"
                  >
                    Accept Handover
                  </button>
                  <button
                    onClick={() => handleDeclineHandover(reqDonation)}
                    className="flex-1 md:flex-initial py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Volunteer Driver Header with Photo */}
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={activeDriver.photo_url || '/driver_photo.png'}
              alt={activeDriver.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-lg shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                <Truck className="w-3.5 h-3.5" /> NGO DELIVERY PARTNER VOLUNTEER
              </div>
              
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-white">{activeDriver.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED DRIVER
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Phone className="w-3.5 h-3.5" /> {activeDriver.phone}
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Bike className="w-3.5 h-3.5" /> Bike No: <strong className="text-white">{activeDriver.bike}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Aadhar: {activeDriver.aadhar}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Switch Active Driver Profile Selector */}
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <select
                value={activeDriver.id}
                onChange={(e) => {
                  const sel = drivers.find(d => d.id === e.target.value);
                  if (sel) setActiveDriver(sel);
                }}
                className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none"
              >
                {drivers.map(drv => (
                  <option key={drv.id} value={drv.id} className="bg-slate-900 text-white">
                    Driver Persona: {drv.name} ({drv.bike})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Coimbatore Mission Notification Alert */}
        {availableDonations.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-300 shadow-xl">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-amber-400 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold text-sm text-white">🚨 {availableDonations.length} Unassigned Coimbatore Food Mission{availableDonations.length > 1 ? 's' : ''} Available!</p>
                <p className="text-xs text-amber-200/90">Surplus food packages are ready for volunteer driver pickup at Coimbatore bus stop landmarks.</p>
              </div>
            </div>
            <a href="#available-missions" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 text-center shadow-lg shadow-amber-500/20 transition-all">
              Claim Mission Below
            </a>
          </div>
        )}

        {/* Map Route Guidance */}
        {currentTab !== 'history' && (() => {
          const currentActiveMission = assignedMissions[0] || null;
          const activeRoutePoints = currentActiveMission ? [
            [currentActiveMission.lat || 11.0090, currentActiveMission.lng || 76.9530],
            [currentActiveMission.matched_ngo?.lat || 11.0123, currentActiveMission.matched_ngo?.lng || 76.9542]
          ] : activeDropRouteModal?.routePoints || null;

          const routeInfo = currentActiveMission ? {
            pickupBusStop: currentActiveMission.bus_stop_name || 'Coimbatore Bus Stop Landmark',
            destinationNgo: currentActiveMission.matched_ngo?.name || 'No Food Waste (Coimbatore HQ)',
            distanceKm: currentActiveMission.route_details?.distanceKm || '3.2',
            travelDurationMins: currentActiveMission.route_details?.travelDurationMins || '14'
          } : activeDropRouteModal?.routeInfo || null;

          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" /> Interactive Leaflet Route Navigation
                </h2>
                {currentActiveMission ? (
                  <span className="text-xs text-amber-400 font-black flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                    🛵 Live Mission Active: {currentActiveMission.title} ({routeInfo?.distanceKm} km)
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                    Standby Mode • No Route Active
                  </span>
                )}
              </div>

              <InteractiveMap 
                zoom={13} 
                donations={donations} 
                activeRoute={!!currentActiveMission || !!activeDropRouteModal} 
                activeRoutePoints={activeRoutePoints}
                activeRouteInfo={routeInfo}
              />

              {/* Detailed Live Mission Route Box Below Map */}
              {currentActiveMission ? (
                <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Live Courier Delivery Details for {activeDriver.name}
                    </span>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      In Transit to NGO
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                        <Bus className="w-3.5 h-3.5" /> 1. Pickup Landmark
                      </p>
                      <p className="font-extrabold text-white text-sm">{currentActiveMission.bus_stop_name || 'Bus Stop Landmark'}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentActiveMission.pickup_address}</p>
                      <p className="text-slate-300 font-semibold pt-1">Donor: {currentActiveMission.restaurant_name || 'Royal Spice Bistro'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> 2. Drop NGO Destination
                      </p>
                      <p className="font-extrabold text-white text-sm">{currentActiveMission.matched_ngo?.name || 'No Food Waste HQ'}</p>
                      <p className="text-slate-400 text-[11px] truncate">{currentActiveMission.matched_ngo?.address || 'Coimbatore HQ'}</p>
                      <p className="text-indigo-300 font-semibold pt-1">📞 {currentActiveMission.matched_ngo?.phone || '+91 98765 43210'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 3. Live ETA & Package
                      </p>
                      <p className="font-extrabold text-emerald-400 text-sm">{routeInfo?.travelDurationMins || '14'} Mins ({routeInfo?.distanceKm || '3.2'} km)</p>
                      <p className="text-slate-300 font-bold">Package: {currentActiveMission.title}</p>
                      <p className="text-emerald-300 font-semibold">Quantity: {currentActiveMission.quantity_kg} kg Surplus</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 font-bold">ℹ️</div>
                  <div>
                    <p className="font-bold text-white">Courier {activeDriver.name} is currently on Standby Mode (0 Active Missions)</p>
                    <p className="text-slate-400">Select and accept an available Coimbatore food mission below to draw your live delivery route!</p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Swiggy / Rapido Style Drop Notification Modal */}
        {activeDropRouteModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[999] animate-in fade-in">
            <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>

              {/* Header Badge */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
                    <Truck className="w-4 h-4" /> SWIGGY / RAPIDO STYLE DROP HUD
                  </span>
                </div>
                <button
                  onClick={() => setActiveDropRouteModal(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2.5 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  ✕ Close HUD
                </button>
              </div>

              {/* Status Alert Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <span>🚨 PICKUP CONFIRMED FROM BUS STOP!</span>
                </div>
                <p className="text-xs text-slate-200">
                  Gemini AI priority-matched the optimal nearby Coimbatore NGO Hub. Driver must travel this distance to complete drop delivery.
                </p>
              </div>

              {/* Route & Distance Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/30">
                    🚏
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-emerald-400 uppercase font-extrabold">A. PICKUP BUS STOP LANDMARK</p>
                    <p className="font-extrabold text-white text-sm">{activeDropRouteModal.busStopName}</p>
                    <p className="text-xs text-slate-400">{activeDropRouteModal.item.pickup_address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold">
                    <Navigation className="w-4.5 h-4.5" />
                    <span>Travel Distance: <strong>{activeDropRouteModal.routeInfo.distanceKm} km</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-400 font-extrabold">
                    <Clock className="w-4.5 h-4.5" />
                    <span>Est. Time: <strong>{activeDropRouteModal.routeInfo.travelDurationMins} Mins</strong></span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0 border border-purple-500/30">
                    🏢
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-purple-400 uppercase font-extrabold">B. DROP DESTINATION NGO HUB</p>
                    <p className="font-extrabold text-white text-sm">{activeDropRouteModal.matchedNgo.name}</p>
                    <p className="text-xs text-slate-400">{activeDropRouteModal.matchedNgo.address}</p>
                    <p className="text-xs text-indigo-300 font-semibold pt-1">📞 Contact NGO: {activeDropRouteModal.matchedNgo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveDropRouteModal(null);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Navigation className="w-4 h-4" /> View Route Marked on Map
                </button>
                <a
                  href={`tel:${activeDropRouteModal.matchedNgo.phone}`}
                  className="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Phone className="w-4 h-4" /> Call NGO Hub
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Unassigned Available Food Missions Section */}
        {currentTab !== 'history' && (
          <div id="available-missions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Available Coimbatore Food Missions ({availableDonations.length})
              </h2>
              <span className="text-xs text-slate-400">Click to accept and auto-route to optimal nearby NGO</span>
            </div>

            {availableDonations.length === 0 ? (
              <div className="p-6 rounded-2xl glass-card border border-slate-800 text-slate-400 text-xs text-center">
                All food packages currently claimed or delivered. Check back when a donor posts new surplus food!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableDonations.map((item) => {
                  const busStop = findNearestBusStop(item.pickup_address);
                  return (
                    <div key={item.id} className="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-4 flex flex-col justify-between shadow-xl">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                            {item.quantity_kg} kg Surplus Available
                          </span>
                          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Expiry Buffer: {item.expiry_hours || 4}h
                          </span>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-white">{item.title}</h3>
                          <p className="text-xs text-slate-400">Donor / Restaurant: <strong className="text-slate-200">{item.restaurant_name || 'Coimbatore Commercial Donor'}</strong></p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                          <p className="text-slate-400 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                            <span>Address: <strong className="text-slate-200">{item.pickup_address}</strong></span>
                          </p>
                          <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Bus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Designated Pickup Point: <strong>{item.bus_stop_name || busStop.name}</strong></span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAcceptMission(item)}
                        disabled={processingId === item.id}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                      >
                        <Truck className="w-4 h-4 text-slate-950" /> Accept Delivery & Auto-Route to NGO
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Delivery Missions List Assigned by NGO */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Active Missions Assigned to Courier Driver
            </h2>
            <span className="text-xs text-slate-400">{displayedMissions.length} Active Missions</span>
          </div>

          {loading && donations.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading delivery missions...</div>
          ) : displayedMissions.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No active claimed missions right now. Accept an available mission above to begin delivery!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedMissions.map((item) => {
                const isCompleted = item.status === 'Delivered' || item.status === 'Completed';
                const driverObj = item.assigned_driver || activeDriver;
                const busStopName = item.bus_stop_name || 'Coimbatore Bus Stop';
                const ngoName = item.matched_ngo?.name || item.ai_predictions?.[0]?.recommendedNGO || 'No Food Waste (Coimbatore HQ)';
                const routeInfo = item.route_details;

                return (
                  <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StatusBadge status={item.status} />
                        <span className="text-xs font-bold text-emerald-400">{item.quantity_kg} kg Food Package</span>
                      </div>

                      <div>
                        <h3 className="font-bold text-base text-white">{item.title}</h3>
                        <p className="text-xs text-slate-400">Pickup Donor: <strong className="text-slate-200">{item.restaurant_name || 'Royal Spice Bistro'}</strong></p>
                      </div>

                      {/* Courier Driver Details Card */}
                      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Assigned Driver Courier</p>
                          <p className="text-slate-200 font-bold truncate">{driverObj.name} ({driverObj.phone})</p>
                          <p className="text-slate-400 text-[11px] truncate">Bike No: <strong className="text-emerald-400">{driverObj.bike}</strong> • Aadhar: {driverObj.aadhar}</p>
                        </div>
                      </div>

                      {/* Smart Route Timeline with Duration & Bus Stop */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-emerald-500/30">
                            🚏
                          </div>
                          <div>
                            <p className="text-[10px] text-emerald-400 uppercase font-bold">A. Bus Stop Pickup Landmark</p>
                            <p className="font-bold text-white">{busStopName}</p>
                            <p className="text-[11px] text-slate-400">{item.pickup_address}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                          <span className="text-indigo-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Estimated Travel: {routeInfo?.travelDurationMins || 15} Mins ({routeInfo?.distanceKm || 3.2} km)
                          </span>
                          <span className="text-emerald-400 font-bold">Auto NGO Match</span>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 border border-purple-500/30">
                            🏢
                          </div>
                          <div>
                            <p className="text-[10px] text-purple-400 uppercase font-bold">B. Destination Matched NGO Hub</p>
                            <p className="font-bold text-white">{ngoName}</p>
                            {item.matched_ngo?.address && (
                              <p className="text-[11px] text-slate-400">{item.matched_ngo.address}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Mission Step Buttons */}
                    <div className="pt-2 space-y-2">
                      {item.status === 'Volunteer Assigned' && (
                        <>
                          <button
                            onClick={() => handleUpdateStep(item.id, 'Picked Up')}
                            disabled={processingId === item.id}
                            className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Confirm Food Pickup at Bus Stop Landmark
                          </button>
                          <button
                            onClick={() => {
                              const otherDrvs = drivers.filter(d => d.name !== activeDriver.name);
                              if (otherDrvs.length > 0) setTargetTransferDriverId(otherDrvs[0].id);
                              setHandoverModalDonation(item);
                            }}
                            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <Sparkles className="w-4 h-4" /> Request Handover / Transfer to Another Driver
                          </button>
                        </>
                      )}

                      {item.status === 'Picked Up' && (
                        <button
                          onClick={() => handleUpdateStep(item.id, 'Delivered')}
                          disabled={processingId === item.id}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <PackageCheck className="w-4 h-4 text-slate-950" /> Confirm Delivered to Matched NGO Hub
                        </button>
                      )}

                      {isCompleted && (
                        <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Delivered to Matched NGO Hub Successfully!
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Driver Handover Transfer Modal */}
        {handoverModalDonation && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[999]">
            <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Transfer Order to Another Driver
                </h3>
                <button onClick={() => setHandoverModalDonation(null)} className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg">✕</button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <p className="text-slate-400">Order: <strong className="text-white">{handoverModalDonation.title}</strong></p>
                <p className="text-slate-400">Quantity: <strong className="text-emerald-400">{handoverModalDonation.quantity_kg} kg</strong></p>
                <p className="text-slate-400">Current Courier: <strong className="text-blue-400">{activeDriver.name}</strong></p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">Select Target Volunteer Driver</label>
                <select
                  value={targetTransferDriverId}
                  onChange={(e) => setTargetTransferDriverId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose Target Driver --</option>
                  {drivers.filter(d => d.name !== activeDriver.name).map(drv => (
                    <option key={drv.id} value={drv.id}>
                      Driver: {drv.name} ({drv.bike})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleRequestHandover(handoverModalDonation.id)}
                  disabled={!targetTransferDriverId}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg"
                >
                  Send Handover Request
                </button>
                <button
                  onClick={() => setHandoverModalDonation(null)}
                  className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default VolunteerDashboard;
