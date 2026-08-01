import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { COIMBATORE_CENTER, COIMBATORE_NGOS, COIMBATORE_DONATION_HUBS } from '../data/coimbatoreData';

// Custom Markers
// Custom Markers without green glow halos
const busStopIcon = L.divIcon({
  className: 'custom-busstop-icon',
  html: `<div style="background: #0ea5e9; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5 solid #ffffff; font-size: 18px; color: #ffffff; shadow: 0 2px 8px rgba(0,0,0,0.5);">🚏</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const ngoIcon = L.divIcon({
  className: 'custom-ngo-icon',
  html: `<div style="background: #a855f7; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; font-size: 18px; color: #ffffff; shadow: 0 2px 8px rgba(0,0,0,0.5);">🏢</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const charityIcon = L.divIcon({
  className: 'custom-charity-icon',
  html: `<div style="background: #f43f5e; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; font-size: 18px; color: #ffffff; shadow: 0 2px 8px rgba(0,0,0,0.5);">❤️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const courierBikeIcon = L.divIcon({
  className: 'custom-courier-icon',
  html: `<div style="background: #ff5200; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #ffffff; font-size: 22px; color: #ffffff; shadow: 0 4px 12px rgba(255, 82, 0, 0.6); transform: scale(1.1); transition: transform 0.3s ease;">🛵</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42]
});

// Helper component to auto-fit map view to active route bounds
const MapViewFitter = ({ points, center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (points && points.length >= 2) {
      try {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true });
      } catch (e) {}
    } else if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [points, center, zoom, map]);
  return null;
};

export const InteractiveMap = ({
  center = COIMBATORE_CENTER,
  zoom = 12,
  donations = [],
  activeRoute = null,
  activeRoutePoints = null,
  activeRouteInfo = null
}) => {
  const mapCenter = center || COIMBATORE_CENTER;
  const displayDonations = donations.length > 0 ? donations : COIMBATORE_DONATION_HUBS;

  // Swiggy style polyline route positions - ONLY set if valid active points provided
  const routePositions = (activeRoutePoints && activeRoutePoints.length >= 2) ? activeRoutePoints : null;

  // Mid-point position for courier bike marker
  const courierMidPoint = (routePositions && routePositions.length >= 2)
    ? [
        (routePositions[0][0] + routePositions[1][0]) / 2,
        (routePositions[0][1] + routePositions[1][1]) / 2
      ]
    : null;

  return (
    <div className="w-full h-80 md:h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-10">
      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        <MapViewFitter points={routePositions} center={mapCenter} zoom={zoom} />

        {/* CartoDB Voyager High Clarity Tile Layer (Bright, Clean, Highly Legible Roads & Street Names) */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Render Coimbatore NGO & Charity Pins */}
        {COIMBATORE_NGOS.map((ngo) => (
          <Marker
            key={ngo.id}
            position={[ngo.lat, ngo.lng]}
            icon={ngo.category === 'charity' ? charityIcon : ngoIcon}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                  {ngo.category === 'charity' ? 'Charity Shelter' : 'Verified NGO'}
                </span>
                <h4 className="font-bold text-sm mt-1">{ngo.name}</h4>
                <p className="text-xs text-slate-600">{ngo.area} • {ngo.type}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">Capacity: {ngo.dailyCapacity}</p>
                {ngo.phone && <p className="text-[11px] text-slate-500 mt-0.5">📞 {ngo.phone}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Coimbatore Bus Stop Pickup Pins */}
        {displayDonations.map((item, idx) => (
          <Marker
            key={item.id || idx}
            position={[
              item.lat || item.latitude || COIMBATORE_CENTER[0] + (idx * 0.004), 
              item.lng || item.longitude || COIMBATORE_CENTER[1] + (idx * 0.004)
            ]}
            icon={busStopIcon}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold">
                  🚏 Bus Stop Pickup Point
                </span>
                <h4 className="font-bold text-sm mt-1">{item.bus_stop_name || item.title}</h4>
                <p className="text-xs text-slate-600">{item.restaurant_name}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  {item.quantity_kg} kg • {item.status || 'Available'}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Moving Swiggy Courier Motorbike Marker along Route - ONLY rendered when active route exists */}
        {routePositions && courierMidPoint && (
          <Marker position={courierMidPoint} icon={courierBikeIcon}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                  🛵 Live Delivery Courier
                </span>
                <p className="font-bold text-xs mt-1">En Route to Destination NGO</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Draw Swiggy / Zomato Style Delivery Route Polyline - ONLY when routePositions exist */}
        {routePositions && (
          <>
            {/* Outer Glow Polyline */}
            <Polyline
              positions={routePositions}
              color="#ff5200"
              weight={7}
              opacity={0.85}
            />
            {/* Inner Animated Dashed Polyline */}
            <Polyline
              positions={routePositions}
              color="#ffffff"
              weight={3}
              dashArray="6, 8"
            />
          </>
        )}
      </MapContainer>
      
      {/* Live Swiggy / Rapido Route Navigation HUD Overlay */}
      {activeRouteInfo && (
        <div className="absolute top-4 left-4 right-4 bg-slate-950/95 border border-emerald-500/40 p-3.5 rounded-2xl backdrop-blur-md shadow-2xl z-[400] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-200 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shrink-0 shadow-lg shadow-emerald-500/20">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] uppercase border border-emerald-500/30">
                  LIVE DROP ROUTE ACTIVE
                </span>
                <span className="text-[11px] font-bold text-amber-400">
                  Priority Match: {activeRouteInfo.matchConfidence || '98%'}
                </span>
              </div>
              <p className="font-extrabold text-sm text-white mt-0.5">
                🚏 {activeRouteInfo.pickupBusStop || 'Bus Stop'} ➔ 🏢 {activeRouteInfo.destinationNgo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">TRAVEL DISTANCE</p>
              <p className="text-sm font-extrabold text-emerald-400">{activeRouteInfo.distanceKm} km</p>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">EST. TIME</p>
              <p className="text-sm font-extrabold text-indigo-400">{activeRouteInfo.travelDurationMins} Mins</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/50 text-xs flex gap-3 z-[400] text-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Bus Stop Pickup</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
          <span>Coimbatore NGO</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
          <span>Charity Shelter</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
