import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  COIMBATORE_CENTER, 
  COIMBATORE_NGOS, 
  COIMBATORE_DONATION_HUBS 
} from '../data/coimbatoreData';
import { 
  MapPin, 
  Heart, 
  Building2, 
  Phone, 
  Search, 
  Navigation, 
  CheckCircle2, 
  Bus,
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

// Custom Leaflet Markers without green glow halos
const ngoMarkerIcon = L.divIcon({
  className: 'custom-ngo-icon',
  html: `<div style="background: #a855f7; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; font-size: 18px; color: white; cursor: pointer;">🏢</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const charityMarkerIcon = L.divIcon({
  className: 'custom-charity-icon',
  html: `<div style="background: #f43f5e; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; font-size: 18px; color: white; cursor: pointer;">❤️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const busStopMarkerIcon = L.divIcon({
  className: 'custom-busstop-icon',
  html: `<div style="background: #0ea5e9; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; font-size: 18px; color: white; cursor: pointer;">🚏</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Helper component to programmatically pan map
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  if (center) {
    map.flyTo(center, zoom, { duration: 1.5 });
  }
  return null;
};

export const CoimbatoreMap = ({ heightClass = "h-[480px]" }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'bus_stops', 'ngos'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCenter, setActiveCenter] = useState(COIMBATORE_CENTER);
  const [zoomLevel, setZoomLevel] = useState(12);

  // Separate Datasets for clear differentiation
  const busStopsList = COIMBATORE_DONATION_HUBS.map(item => ({ ...item, categoryType: 'bus_stop_pickup' }));
  const ngosList = COIMBATORE_NGOS.map(item => ({ ...item, categoryType: 'ngo_charity' }));

  const allLocations = [...busStopsList, ...ngosList];

  // Filter logic
  const filteredBusStops = busStopsList.filter(loc => 
    (loc.bus_stop_name || loc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.area || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNgos = ngosList.filter(loc => 
    (loc.name || loc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.area || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc) => {
    setActiveCenter([loc.lat, loc.lng]);
    setZoomLevel(14);
  };

  return (
    <div className="w-full space-y-8">
      {/* Map Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Coimbatore Bus Stops (Gandhipuram, RS Puram, Singanallur, Peelamedu, Ukkadam...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Places on Map', count: allLocations.length, color: 'bg-slate-800 text-slate-200 border-slate-700' },
            { id: 'bus_stops', label: '🚏 Bus Stop Pickups Only', count: busStopsList.length, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            { id: 'ngos', label: '🏢 NGO & Charity Hubs', count: ngosList.length, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                filter === btn.id 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{btn.label}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px]">{btn.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div className={`w-full ${heightClass} rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative z-10`}>
        <MapContainer 
          center={COIMBATORE_CENTER} 
          zoom={12} 
          scrollWheelZoom={true} 
          className="w-full h-full"
        >
          <ChangeView center={activeCenter} zoom={zoomLevel} />
          
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Render Markers based on active filter */}
          {(filter === 'all' || filter === 'bus_stops') && filteredBusStops.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={busStopMarkerIcon}
            >
              <Popup className="coimbatore-custom-popup">
                <div className="p-2 min-w-[260px] font-sans text-slate-900">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                      🚏 Coimbatore Bus Stop Pickup Point
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {loc.bus_stop_name}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 mt-1">
                    📦 {loc.title}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>{loc.address}</span>
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                    <p className="text-emerald-700 font-bold">
                      <strong>Surplus Quantity:</strong> {loc.quantity_kg} kg ({loc.servings} servings)
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {(filter === 'all' || filter === 'ngos') && filteredNgos.map((loc) => {
            const isCharity = loc.category === 'charity';
            return (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={isCharity ? charityMarkerIcon : ngoMarkerIcon}
              >
                <Popup className="coimbatore-custom-popup">
                  <div className="p-2 min-w-[260px] font-sans text-slate-900">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        isCharity ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {isCharity ? '❤️ Charity Shelter' : '🏢 Verified NGO Hub'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span>{loc.address}</span>
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs space-y-1">
                      <p className="text-slate-700"><strong>Daily Capacity:</strong> {loc.dailyCapacity}</p>
                      <p className="text-slate-700">📞 <strong>Contact:</strong> {loc.phone}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Active Swiggy style delivery route polyline */}
          <Polyline
            positions={[
              [11.0090, 76.9530], // RS Puram Bus Stop Pickup
              [11.0123, 76.9542], // No Food Waste HQ Drop NGO
              [11.0183, 76.9654]  // Gandhipuram Bus Stand
            ]}
            color="#ff5200"
            weight={6}
            dashArray="8, 8"
          />
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-slate-950/95 border border-slate-800 p-3 rounded-xl backdrop-blur-md shadow-2xl z-[400] text-xs flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow"></span>
            <span className="font-bold text-emerald-400">🚏 Bus Stop Pickups ({busStopsList.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-500 border border-white shadow"></span>
            <span className="font-bold text-purple-300">🏢 NGO Hubs (3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white shadow"></span>
            <span className="font-bold text-rose-300">❤️ Charity Shelters (5)</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC DIFFERENTIATED SECTIONS BELOW MAP */}
      <div className="space-y-10 pt-4">
        
        {/* SECTION 1: COIMBATORE BUS STOP PICKUP LANDMARKS */}
        {(filter === 'all' || filter === 'bus_stops') && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-xl shrink-0">
                  🚏
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Coimbatore Bus Stop Pickup Landmarks ({filteredBusStops.length} Locations)
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Designated surplus food pickup points located at all major bus stands across Coimbatore.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                12 Bus Stop Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBusStops.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group hover:scale-[1.02] shadow-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Bus className="w-3 h-3 text-emerald-400" /> Bus Stop Pickup
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{loc.area}</span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                      {loc.bus_stop_name}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium mt-1">
                      📦 {loc.title}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <p className="line-clamp-1">📍 {loc.address}</p>
                    <p className="text-emerald-400 font-bold">Surplus: {loc.quantity_kg} kg ({loc.servings} meals)</p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Locate on Map</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: VERIFIED NGO HUBS & CHARITY CENTERS */}
        {(filter === 'all' || filter === 'ngos') && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-extrabold text-xl shrink-0">
                  🏢
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    Verified NGO Hubs & Charity Shelters ({filteredNgos.length} Hubs)
                  </h3>
                  <p className="text-xs text-purple-300">
                    Registered hunger-relief organizations, shelters, and food banks receiving surplus food in Coimbatore.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                8 Partner Hubs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredNgos.map((loc) => {
                const isCharity = loc.category === 'charity';
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc)}
                    className={`p-5 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer group hover:scale-[1.02] shadow-xl space-y-3 ${
                      isCharity ? 'border-rose-500/30 hover:border-rose-400' : 'border-purple-500/30 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        isCharity 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {isCharity ? '❤️ Charity Shelter' : '🏢 NGO Hub'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">{loc.area}</span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{loc.type}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-300">
                      <p className="font-semibold text-purple-300">Capacity: {loc.dailyCapacity}</p>
                      <p className="text-slate-400">📞 {loc.phone}</p>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs font-bold text-purple-400">
                      <span>Locate NGO</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CoimbatoreMap;
