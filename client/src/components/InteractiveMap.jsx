import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix leafet default icon marker URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const foodIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const ngoIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913524.png',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

export const InteractiveMap = ({
  center = [12.9716, 77.5946],
  zoom = 13,
  donations = [],
  activeRoute = null
}) => {
  const defaultCenter = center || [12.9716, 77.5946];

  return (
    <div className="w-full h-80 md:h-96 rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Donation Pins */}
        {donations.map((item, idx) => (
          <Marker
            key={item.id || idx}
            position={[item.latitude || 12.9716 + idx * 0.005, item.longitude || 77.5946 + idx * 0.005]}
            icon={foodIcon}
          >
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.restaurant_name}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">{item.quantity_kg} kg • {item.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Demo NGO Hub Marker */}
        <Marker position={[12.9750, 77.6000]} icon={ngoIcon}>
          <Popup>
            <div className="text-slate-900 font-sans p-1">
              <h4 className="font-bold text-sm">Care & Share Foundation</h4>
              <p className="text-xs text-slate-600">Primary NGO Hub</p>
            </div>
          </Popup>
        </Marker>

        {/* Draw active delivery route if available */}
        {activeRoute && (
          <Polyline
            positions={[
              [12.9716, 77.5946],
              [12.9735, 77.5975],
              [12.9750, 77.6000]
            ]}
            color="#10b981"
            weight={5}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/50 text-xs flex gap-4 z-[400]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Donation Point</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
          <span>NGO Hub</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
